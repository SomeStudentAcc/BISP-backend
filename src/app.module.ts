import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { CompanyModule } from './modules/company/company.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { FileModule } from './modules/file/file.module';
import { CharacteristicModule } from './modules/characteristic/characteristic.module';
import { DillerModule } from './modules/diller/diller.module';
import { ExportsModule } from './modules/exports/exports.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CompanyModule,
    WarehouseModule,
    FileModule,
    CharacteristicModule,
    DillerModule,
    ExportsModule,
    StatisticsModule,
  ],
})
export class AppModule {}
