import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EnvironmentService } from 'src/app-config/environment.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<{
        id: number;
        name: string;
        email: string;
      }>(token, {
        secret: this.environmentService.JWT_SECRET,
      });

      request['user'] = payload;
    } catch (error) {
      this.logger.error('Cannot activate auth guard: ', error);
      throw new UnauthorizedException(error);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const fullToken = request.headers['authorization'];
    if (!fullToken) {
      return undefined;
    }
    const [type, token] = fullToken?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
