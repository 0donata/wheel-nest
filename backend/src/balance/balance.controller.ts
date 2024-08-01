import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Balance } from 'src/entities/balances.entity';
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

@Controller('balances')
export class BalancesController {
  constructor(private balanceService: BalanceService) {}

  @Get()
  findAll(): Promise<Balance[]> {
    return this.balanceService.findAll();
  }
}
