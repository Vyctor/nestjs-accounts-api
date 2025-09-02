import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { IsNull, Repository } from 'typeorm';
import { hash, genSalt } from 'bcrypt';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<void> {
    const accountExists = await this.accountRepository.findOne({
      where: {
        email: createAccountDto.email,
      },
    });

    if (accountExists && !accountExists.deletedAt) {
      throw new BadRequestException('Cannot create account');
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(createAccountDto.password, salt);

    try {
      await this.accountRepository.save(
        this.accountRepository.create({
          name: createAccountDto.name,
          email: createAccountDto.email,
          password: hashedPassword,
        }),
      );
    } catch (error) {
      this.logger.error('Cannot create account: ', error);
      throw new InternalServerErrorException('Cannot create account');
    }

    return;
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async findOne(id: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async findByEmail(email: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: {
        email,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async remove(id: number): Promise<void> {
    const account = await this.accountRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    await this.accountRepository.update(id, { deletedAt: new Date() });
    return;
  }
}
