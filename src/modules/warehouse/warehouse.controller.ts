import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserPayload } from '../auth/strategies/jwt.strategy';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { CreateImportDto } from './dto/create-import.dto';
import { CreateExportDto } from './dto/create-export.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Auth()
  @Get()
  async getAllWarehouses(@CurrentUser() user: UserPayload) {
    return this.warehouseService.getAll(user);
  }

  @Auth()
  @Get(':id')
  async getWarehouseById(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.warehouseService.getById(user, id);
  }

  @Auth()
  @Post()
  async createWarehouse(
    @Body() dto: CreateWarehouseDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.warehouseService.create(dto, user);
  }

  @Auth()
  @Post('import/:id')
  async addProducts(
    @Body() dto: CreateImportDto,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.warehouseService.addProduct(dto, user, id);
  }

  @Auth()
  @Post('export/:id')
  exportProduct(
    @Body() dto: CreateExportDto,
    @CurrentUser() user: UserPayload,
    @Param('id') warehouseId: string,
  ) {
    return this.warehouseService.exportProduct(dto, user, warehouseId);
  }

  @Auth()
  @Patch(':id')
  async updateWarehouse(
    @Body() dto: UpdateWarehouseDto,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.warehouseService.update(dto, user, id);
  }

  @Auth()
  @Delete(':id')
  async deleteWarehouse(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.warehouseService.delete(user, id);
  }
}
