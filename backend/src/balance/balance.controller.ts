import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('user/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':id')
  getBalance(@Param('id') id: number) {
    return this.balanceService.getBalance(id);
  }

  @Post()
  updateBalance(
    @Body() updateBalanceDto: { id: number; balanceId: number; amount: number },
  ) {
    return this.balanceService.updateBalance(
      updateBalanceDto.id,
      updateBalanceDto.balanceId,
      updateBalanceDto.amount,
    );
  }
}
