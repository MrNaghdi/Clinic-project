import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum ArticleCategory {
    Skin = 'skin',
    Hair = 'hair',
    Beauty = 'beauty',
    Laser = 'laser',
    Tips = 'tips',
    News = 'news',
}

@Entity('articles')
@Index(['is_published', 'published_at'])
@Index(['is_featured'])
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'varchar', length: 220, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 500 })
    excerpt: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    cover_image: string | null;

    @Column({
        type: 'enum',
        enum: ArticleCategory,
        default: ArticleCategory.Skin,
    })
    category: ArticleCategory;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[] | null;

    @Column({ default: false })
    is_published: boolean;

    @Column({ default: false })
    is_featured: boolean;

    @Column({ type: 'timestamp', nullable: true })
    published_at: Date | null;

    @Column({ type: 'int', default: 0 })
    views: number;

    @Column({ type: 'int', default: 0 })
    read_time: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}