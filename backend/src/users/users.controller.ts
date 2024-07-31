import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post('add-spin')
  addSpin(@Body('id') id: string): Promise<User> {
    return this.userService.addSpin(id);
  }
  @Get('spins/:telegramId')
  async getUserSpins(@Param('telegramId') telegramId: string) {
    const spins = await this.userService.getUserSpins(telegramId);
    return { spins };
  }
}
