import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AuthService } from './auth.service';
import { EnvironmentService } from 'src/app-config/environment.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    AppConfigModule,
    forwardRef(() => AccountsModule),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (configService: EnvironmentService) => ({
        global: true,
        secret: configService.JWT_SECRET,
        signOptions: { expiresIn: configService.JWT_EXPIRES_IN },
      }),
      inject: [EnvironmentService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
