import { Controller, Get, Param } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserPayload } from '../auth/strategies/jwt.strategy';

@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Auth()
  @Get(':id')
  async getExportById(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.exportsService.getById(id, user);
  }
}
