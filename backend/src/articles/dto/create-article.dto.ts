import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ArticleCategory } from '../entities/article.entity';

export class CreateArticleDto {
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(220)
    slug?: string;

    @IsString()
    @MinLength(10)
    @MaxLength(500)
    excerpt: string;

    @IsString()
    @MinLength(20)
    content: string;

    @IsOptional()
    @IsString()
    cover_image?: string;

    @IsEnum(ArticleCategory)
    category: ArticleCategory;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsBoolean()
    is_featured?: boolean;

    @IsOptional()
    @IsInt()
    read_time?: number;
}