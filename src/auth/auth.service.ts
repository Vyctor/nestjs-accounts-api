import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from 'src/accounts/accounts.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(input: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    try {
      const account = await this.accountsService.findByEmail(input.email);
      if (!account) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordValid = await compare(input.password, account.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return {
        accessToken: this.jwtService.sign({
          id: account.id,
          name: account.name,
          email: account.email,
        }),
      };
    } catch (error) {
      this.logger.error('Cannot sign in: ', error);
      throw new UnauthorizedException('Cannot sign in');
    }
  }
}
