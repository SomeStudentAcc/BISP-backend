import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DillerService } from './diller.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserPayload } from '../auth/strategies/jwt.strategy';
import { CreateDillerDto } from './dto/create-diller.dto';

@Controller('diller')
export class DillerController {
  constructor(private readonly dillerService: DillerService) {}

  // ─── Static routes first ───────────────────────────────
  @Auth()
  @Get()
  async getAllDillers(@CurrentUser() user: UserPayload) {
    return this.dillerService.getAll(user);
  }

  @Auth()
  @Get('me')
  getDillerByUserId(@CurrentUser() user: UserPayload) {
    return this.dillerService.getMe(user);
  }

  @Auth()
  @Get('inventory/:id')
  getDillerInventory(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.dillerService.getDillerInventory(id, user);
  }

  @Auth()
  @Get('exports/:id')
  async getDillerExports(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.dillerService.getDillerExports(id, user);
  }

  // ─── Dynamic routes last ───────────────────────────────
  @Auth()
  @Get(':id')
  async getDillerbyId(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.dillerService.getById(id, user);
  }

  @Auth()
  @Post()
  async createDiller(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateDillerDto,
  ) {
    return this.dillerService.create(dto, user);
  }

  @Auth()
  @Patch(':id')
  async updateDiller(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateDillerDto,
    @Param('id') id: string,
  ) {
    return this.dillerService.update(id, dto, user);
  }

  @Auth()
  @Delete(':id')
  async deleteDiller(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.dillerService.delete(id, user);
  }
}
