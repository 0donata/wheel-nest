import { Body, Controller, Post } from '@nestjs/common';
import { SpinService } from './spin.service';

@Controller('spin')
export class SpinController {
  constructor(private readonly spinService: SpinService) {}

  @Post()
  async spin(@Body('telegramId') id: number) {
    const result = await this.spinService.spinWheel(id);
    return result;
  }
}
