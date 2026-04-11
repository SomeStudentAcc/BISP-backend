import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { UpdateCategoryDto } from './dto/UpdateCategory.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, user: UserPayload) {
    const category = await this.prismaService.category.create({
      data: {
        ...createCategoryDto,
        image: createCategoryDto.image[0].url,
        companyId: user.companyId,
      },
    });

    return category;
  }

  async update(
    updateCategoryDto: UpdateCategoryDto,
    categoryId: string,
    user: UserPayload,
  ) {
    // 1️⃣ Get current category characteristics
    const currentCategory = await this.prismaService.category.findUnique({
      where: { id: categoryId, companyId: user.companyId },
    });

    if (!currentCategory) {
      throw new Error('Category not found');
    }

    // 4️⃣ Update category
    const category = await this.prismaService.category.update({
      where: {
        id: categoryId,
        companyId: user.companyId,
      },
      data: {
        ...updateCategoryDto,
        image:
          updateCategoryDto.image && updateCategoryDto.image.length
            ? updateCategoryDto.image[0]?.url
            : currentCategory.image,
      },
    });

    return category;
  }

  async delete(id: string) {
    const category = await this.prismaService.category.delete({
      where: { id },
    });

    return category;
  }

  async getCategoryById(id: string, user: UserPayload) {
    const category = await this.prismaService.category.findUnique({
      where: { id, companyId: user.companyId },
    });

    return category;
  }

  async getAll(user: UserPayload) {
    const categories = await this.prismaService.category.findMany({
      where: {
        companyId: user.companyId,
      },
    });

    return categories;
  }
}
