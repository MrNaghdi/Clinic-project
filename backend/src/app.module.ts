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
        entities: [User, Otp, Service, Specialist, WorkingHours],
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
        const store = new KeyvRedis('redis://localhost:6379');
        return {
          stores: [new Keyv({ store })],
        };
      },
    }),
    AuthModule,
    UsersModule,
    ServicesModule,
    SpecialistModule,
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