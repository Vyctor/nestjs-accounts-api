import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createAccountDto: CreateAccountDto) {
    await this.accountsService.create(createAccountDto);
    return {
      message: 'Account created successfully',
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.accountsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.accountsService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    await this.accountsService.remove(+id);
  }
}
