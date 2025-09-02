import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(3000),
        DATABASE_TYPE: Joi.string().valid('mysql').default('mysql'),
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(3306),
        DATABASE_USERNAME: Joi.string().default('root'),
        DATABASE_PASSWORD: Joi.string().default('root'),
        DATABASE_NAME: Joi.string().default('accounts'),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        JWT_SECRET: Joi.string().min(32).optional(),
        JWT_EXPIRES_IN: Joi.string()
          .pattern(/^\d+[smhd]$/)
          .default('1h'),
      }),
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class AppConfigModule {}
