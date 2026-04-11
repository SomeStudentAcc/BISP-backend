import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserPayload } from '../auth/strategies/jwt.strategy';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth()
  @Get()
  async getStatistics(@CurrentUser() user: UserPayload) {
    return this.statisticsService.getStatistics(user);
  }
}
