import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UserPayload } from '../auth/strategies/jwt.strategy';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  public constructor(private readonly prismaService: PrismaService) {}

  async getAll(user: UserPayload) {
    const products = await this.prismaService.product.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        characteristics: true,
        warehouseProducts: true,
      },
    });
    return products;
  }

  async getByCategory(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: { id: categoryId },
    });
    return products;
  }

  async getById(id: string, user: UserPayload) {
    const product = await this.prismaService.product.findUnique({
      where: { id, companyId: user.companyId },
      include: {
        /*         warehouses: true,
         */ characteristics: true,
      },
    });
    return product;
  }

  async create(user: UserPayload, dto: CreateProductDto) {
    const product = await this.prismaService.product.create({
      data: {
        name: dto.name,
        url: dto.url,
        categoryId: dto.categoryId,
        companyId: user.companyId,
        images: dto.images,

        characteristics: {
          create: dto.characteristics.map((char) => ({
            title: char.title,
            value: char.value,
          })),
        },

        /*   warehouses: {
          connect: dto.warehouseIds?.map((id) => ({ id })) || [],
        }, */
      },
      include: {
        characteristics: true,
      },
    });

    return product;
  }

  async update(dto: UpdateProductDto, id: string, user: UserPayload) {
    const product = await this.prismaService.product.findUnique({
      where: { id, companyId: user.companyId },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    const productToUpdate = await this.prismaService.product.update({
      where: { id, companyId: user.companyId },
      data: {
        name: dto.name,
        url: dto.url,
        categoryId: dto.categoryId,
        companyId: user.companyId,
        images: dto.images,

        /*     warehouses: {
          connect: dto.warehouseIds?.map((id) => ({ id })) || [],
        }, */
      },
    });
    return productToUpdate;
  }

  async delete(id: string, user: UserPayload) {
    await this.prismaService.product.delete({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    return { message: 'deleted' };
  }
}
