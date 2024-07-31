import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
  }

  async addSpin(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (user) {
      user.spins += 1;
      return this.usersRepository.save(user);
    }
    return null;
  }
  async getUserSpins(telegramId: string): Promise<number> {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(telegramId, 10) },
    });
    if (user) {
      return user.spins;
    }
    throw new Error('User not found');
  }
}
