import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CretaeCharacteristicsDto } from './dto/create-characteristics.dto';
import { DeleteCharacteristicsDto } from './dto/delete-characteristic.dto';
import { UpdateCharacteristicsDto } from './dto/update-characteristics.dto';

@Controller('characteristic')
export class CharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Post()
  async createCharacteristic(@Body() dto: CretaeCharacteristicsDto) {
    return this.characteristicService.create(dto);
  }
  @Patch()
  async updateCharacteristic(@Body() dto: UpdateCharacteristicsDto) {
    return this.characteristicService.update(dto);
  }
  @Delete()
  async deleteCharacteristic(@Body() dto: DeleteCharacteristicsDto) {
    return this.characteristicService.delete(dto);
  }
}
