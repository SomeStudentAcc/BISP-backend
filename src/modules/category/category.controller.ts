import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserPayload } from '../auth/strategies/jwt.strategy';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get()
  async getAllCategories(@CurrentUser() user: UserPayload) {
    return this.categoryService.getAll(user);
  }

  @Auth()
  @Get(':id')
  async getCategoryById(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.categoryService.getCategoryById(id, user);
  }

  @Auth()
  @Post()
  async createCategory(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.categoryService.create(dto, user);
  }

  @Auth()
  @Patch(':categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.categoryService.update(dto, categoryId, user);
  }

  @Auth()
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
