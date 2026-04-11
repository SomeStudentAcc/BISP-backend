import { Module } from '@nestjs/common';
import { DillerService } from './diller.service';
import { DillerController } from './diller.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [DillerController],
  providers: [DillerService],
  imports: [UserModule],
})
export class DillerModule {}
