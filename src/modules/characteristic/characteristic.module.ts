import { Module } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicController } from './characteristic.controller';

@Module({
  controllers: [CharacteristicController],
  providers: [CharacteristicService],
})
export class CharacteristicModule {}
