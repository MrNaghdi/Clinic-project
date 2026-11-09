import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Otp } from './auth/entities/otp.entity';
import { JwtModule } from '@nestjs/jwt';
import { ServicesModule } from './services/services.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Service } from './services/entities/service.entity';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { SpecialistModule } from './specialist/specialist.module';
import { Specialist } from './specialist/entities/specialist.entity';
import { WorkingHours } from './specialist/entities/workingHours.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './appointments/entities/appointment.entity';
import { AdminModule } from './admin/admin.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { PublicModule } from './public/public.module';
import { ContactModule } from './contact/contact.module';
import { ContactMessage } from './contact/entities/contact-message.entity';
import { ContactReply } from './contact/entities/contact-reply.entity';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/entities/article.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Otp, Service, Specialist, WorkingHours, Appointment, Review, ContactMessage, ContactReply, Article],
        synchronize: true,
        timezone: 'Asia/Tehran',
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(configService.getOrThrow('JWT_ACCESS_EXPIRES_IN')),
        },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const logger = new Logger('Redis');
    
        const store = new KeyvRedis('redis://127.0.0.1:6379');
        store.on('error', (err) => logger.error('KeyvRedis error:', err));
    
        const keyv = new Keyv({ store });
        keyv.on('error', (err) => logger.error('Keyv error:', err));
    
        return { stores: [keyv] };
      },
    }),
    AuthModule,
    UsersModule,
    ServicesModule,
    SpecialistModule,
    AppointmentsModule,
    AdminModule,
    ReviewsModule,
    PublicModule,
    ContactModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    this.logger.log('✅ Database connected successfully');
  }
}