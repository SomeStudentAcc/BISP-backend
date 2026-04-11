import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CretaeCharacteristicsDto } from './dto/create-characteristics.dto';
import { UpdateCharacteristicsDto } from './dto/update-characteristics.dto';
import { DeleteCharacteristicsDto } from './dto/delete-characteristic.dto';

@Injectable()
export class CharacteristicService {
  public constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CretaeCharacteristicsDto) {
    const char = await this.prismaService.productCharacteristic.create({
      data: {
        title: dto.title,
        value: dto.value,
        productId: dto.productId,
      },
    });
    return char;
  }

  async update(dto: UpdateCharacteristicsDto) {
    const char = await this.prismaService.productCharacteristic.update({
      where: {
        productId: dto.productId,
        id: dto.id,
      },
      data: {
        title: dto.title,
        value: dto.value,
      },
    });
    return char;
  }

  async delete(dto: DeleteCharacteristicsDto) {
    const char = await this.prismaService.productCharacteristic.delete({
      where: {
        productId: dto.productId,
        id: dto.id,
      },
    });
    return char;
  }
}
