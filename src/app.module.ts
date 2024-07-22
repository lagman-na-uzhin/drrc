import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UserModule } from "./users/users.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
  imports: [
  ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      username: configService.get<string>('database.username'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.database'),
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        ca: configService.get<string>('database.ssl.ca'),
      },
    }),
    inject: [ConfigService],
  }),
  CacheModule.register(),
  BullModule.forRoot({
  }),
  UserModule,
],
})
export class AppModule {}
