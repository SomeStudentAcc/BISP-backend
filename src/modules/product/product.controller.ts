import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UserPayload } from '../auth/strategies/jwt.strategy';
import { Auth } from '../auth/decorators/auth.decorator';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth()
  @Get()
  async getAllProducts(@CurrentUser() user: UserPayload) {
    return await this.productService.getAll(user);
  }

  @Auth()
  @Get(':id')
  async getProductById(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return await this.productService.getById(id, user);
  }

  @Auth()
  @Patch(':id')
  async updateProduct(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.update(dto, id, user);
  }

  @Auth()
  @Post()
  async createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.productService.create(user, dto);
  }

  @Auth()
  @Delete(':id')
  async deleteProduct(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return await this.productService.delete(id, user);
  }
}
