import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticlesDto } from './dto/list-articles.dto';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepo: Repository<Article>,
    ) { }

    private generateSlug(title: string): string {
        return title
            .trim()
            .toLowerCase()
            .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    private calculateReadTime(content: string): number {
        const words = content.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    }

    async list(dto: ListArticlesDto) {
        const page = Math.max(1, Number(dto.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(dto.limit) || 12));
        const skip = (page - 1) * limit;

        const qb = this.articleRepo
            .createQueryBuilder('article')
            .orderBy('article.is_featured', 'DESC')
            .addOrderBy('article.published_at', 'DESC', 'NULLS LAST')
            .addOrderBy('article.created_at', 'DESC')
            .skip(skip)
            .take(limit);

        if (dto.published_only !== 'false') {
            qb.andWhere('article.is_published = :pub', { pub: true });
        }

        if (dto.featured_only === 'true') {
            qb.andWhere('article.is_featured = :feat', { feat: true });
        }

        if (dto.category) {
            qb.andWhere('article.category = :cat', { cat: dto.category });
        }

        if (dto.search) {
            qb.andWhere(
                '(article.title ILIKE :q OR article.excerpt ILIKE :q OR article.content ILIKE :q)',
                { q: `%${dto.search}%` },
            );
        }

        if (dto.tag) {
            qb.andWhere(':tag = ANY(article.tags)', { tag: dto.tag });
        }

        const [items, total] = await qb.getManyAndCount();

        return {
            items,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }

    async findBySlug(slug: string) {
        const article = await this.articleRepo.findOne({ where: { slug } });
        if (!article || !article.is_published) {
            throw new NotFoundException('مقاله یافت نشد');
        }
        return article;
    }

    async findById(id: number) {
        const article = await this.articleRepo.findOne({ where: { id } });
        if (!article) throw new NotFoundException('مقاله یافت نشد');
        return article;
    }

    async incrementViews(id: number) {
        await this.articleRepo.increment({ id }, 'views', 1);
        return { success: true };
    }

    async create(dto: CreateArticleDto) {
        const slug = dto.slug
            ? this.generateSlug(dto.slug)
            : this.generateSlug(dto.title);

        const existing = await this.articleRepo.findOne({ where: { slug } });
        if (existing) {
            throw new ConflictException('مقاله‌ای با این slug از قبل وجود دارد');
        }

        const article = this.articleRepo.create({
            title: dto.title,
            slug,
            excerpt: dto.excerpt,
            content: dto.content,
            cover_image: dto.cover_image ?? null,
            category: dto.category,
            tags: dto.tags ?? null,
            is_published: true,
            is_featured: dto.is_featured ?? false,
            published_at: new Date(),
            read_time: dto.read_time ?? this.calculateReadTime(dto.content),
        });

        return this.articleRepo.save(article);
    }

    async update(id: number, dto: UpdateArticleDto) {
        const article = await this.findById(id);

        if (dto.title !== undefined) article.title = dto.title;
        if (dto.slug !== undefined) {
            const newSlug = this.generateSlug(dto.slug);
            if (newSlug !== article.slug) {
                const existing = await this.articleRepo.findOne({
                    where: { slug: newSlug },
                });
                if (existing) {
                    throw new ConflictException('مقاله‌ای با این slug از قبل وجود دارد');
                }
                article.slug = newSlug;
            }
        }
        if (dto.excerpt !== undefined) article.excerpt = dto.excerpt;
        if (dto.content !== undefined) {
            article.content = dto.content;
            article.read_time = this.calculateReadTime(dto.content);
        }
        if (dto.cover_image !== undefined) {
            article.cover_image = dto.cover_image;
        }
        if (dto.category !== undefined) article.category = dto.category;
        if (dto.tags !== undefined) article.tags = dto.tags;
        if (dto.read_time !== undefined) article.read_time = dto.read_time;
        if (dto.is_featured !== undefined) article.is_featured = dto.is_featured;

        return this.articleRepo.save(article);
    }

    async remove(id: number) {
        const article = await this.findById(id);
        await this.articleRepo.delete(id);
        return { message: 'مقاله حذف شد', id };
    }

    async uploadCover(id: number, imagePath: string) {
        const article = await this.findById(id);
        article.cover_image = imagePath;
        return this.articleRepo.save(article);
    }
}