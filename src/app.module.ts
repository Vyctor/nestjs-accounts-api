import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { AccountsModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentService } from './app-config/environment.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    AccountsModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: EnvironmentService) => ({
        type: configService.DATABASE_TYPE,
        host: configService.DATABASE_HOST,
        port: configService.DATABASE_PORT,
        username: configService.DATABASE_USERNAME,
        password: configService.DATABASE_PASSWORD,
        database: configService.DATABASE_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [EnvironmentService],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
