import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ArticleCategory } from '../entities/article.entity';

export class ListArticlesDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(ArticleCategory)
    category?: ArticleCategory;

    @IsOptional()
    @IsString()
    tag?: string;

    @IsOptional()
    @IsIn(['true', 'false'])
    published_only?: string;

    @IsOptional()
    @IsIn(['true', 'false'])
    featured_only?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;
}