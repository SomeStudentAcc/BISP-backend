import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UserPayload } from '../auth/strategies/jwt.strategy';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { CreateImportDto } from './dto/create-import.dto';
import { CreateExportDto } from './dto/create-export.dto';

@Injectable()
export class WarehouseService {
  public constructor(private readonly prismaService: PrismaService) {}

  async getAll(user: UserPayload) {
    const warehouses = await this.prismaService.warehouse.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        warehouseProducts: true,
      },
    });

    if (!warehouses) {
      return [];
    }
    return warehouses;
  }

  async getById(user: UserPayload, id: string) {
    const warehouses = await this.prismaService.warehouse.findUnique({
      where: {
        companyId: user.companyId,
        id,
      },
      include: {
        warehouseProducts: {
          include: {
            product: true,
          },
        },
      },
    });
    return warehouses;
  }

  async create(dto: CreateWarehouseDto, user: UserPayload) {
    const warehouse = await this.prismaService.warehouse.create({
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        manager: dto.manager,
        /*   products: {
          connect: dto.productIds?.map((id) => ({ id })),
        }, */
        companyId: user.companyId,
      },
    });
    return warehouse;
  }

  async update(dto: UpdateWarehouseDto, user: UserPayload, id: string) {
    const warehouse = await this.prismaService.warehouse.update({
      where: {
        companyId: user.companyId,
        id,
      },
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        manager: dto.manager,
      },
    });
    return warehouse;
  }

  async delete(user: UserPayload, id: string) {
    const warehouse = await this.prismaService.warehouse.delete({
      where: {
        companyId: user.companyId,
        id,
      },
    });
    return warehouse;
  }

  async addProduct(
    dto: CreateImportDto,
    user: UserPayload,
    warehouseId: string,
  ) {
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id: warehouseId, companyId: user.companyId },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id ${warehouseId} not found`);
    }

    if (!dto.products?.length) {
      throw new BadRequestException('No products provided');
    }

    return this.prismaService.$transaction(async (tx) => {
      // 1. Upsert all warehouse products
      const addedProds = await Promise.all(
        dto.products.map(({ productId, quantity }) =>
          tx.warehouseProduct.upsert({
            where: { warehouseId_productId: { warehouseId, productId } },
            create: { warehouseId, productId, quantity },
            update: { quantity: { increment: quantity } },
          }),
        ),
      );

      // 2. Recompute totalQuantity for each affected product
      await Promise.all(
        dto.products.map(async ({ productId }) => {
          const { _sum } = await tx.warehouseProduct.aggregate({
            where: { productId },
            _sum: { quantity: true },
          });

          await tx.product.update({
            where: { id: productId },
            data: { totalQuantity: _sum.quantity ?? 0 },
          });
        }),
      );

      return addedProds;
    });
  }

  async exportProduct(
    dto: CreateExportDto,
    user: UserPayload,
    warehouseId: string,
  ) {
    // Validate warehouse belongs to company
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id: warehouseId, companyId: user.companyId },
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse ${warehouseId} not found`);
    }

    // Validate diller belongs to same company
    const diller = await this.prismaService.diller.findFirst({
      where: { userId: dto.dillerUserId, companyId: user.companyId },
    });
    if (!diller) {
      throw new NotFoundException(`Diller not found in this company`);
    }

    if (!dto.products?.length) {
      throw new BadRequestException('No products provided');
    }

    // Check stock for all products upfront before touching the DB
    const warehouseProducts =
      await this.prismaService.warehouseProduct.findMany({
        where: {
          warehouseId,
          productId: { in: dto.products.map((p) => p.productId) },
        },
      });

    for (const { productId, quantity } of dto.products) {
      const stock = warehouseProducts.find((wp) => wp.productId === productId);
      if (!stock || stock.quantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${productId}. ` +
            `Requested: ${quantity}, available: ${stock?.quantity ?? 0}`,
        );
      }
    }

    return this.prismaService.$transaction(async (tx) => {
      // 1. Decrement quantities in warehouse
      await Promise.all(
        dto.products.map(({ productId, quantity }) =>
          tx.warehouseProduct.update({
            where: { warehouseId_productId: { warehouseId, productId } },
            data: { quantity: { decrement: quantity } },
          }),
        ),
      );

      // 2. Recompute totalQuantity for each affected product
      await Promise.all(
        dto.products.map(async ({ productId }) => {
          const { _sum } = await tx.warehouseProduct.aggregate({
            where: { productId },
            _sum: { quantity: true },
          });
          await tx.product.update({
            where: { id: productId },
            data: { totalQuantity: _sum.quantity ?? 0 },
          });
        }),
      );

      // 3. Create the export record for traceability
      const exportRecord = await tx.export.create({
        data: {
          warehouseId,
          dillerUserId: dto.dillerUserId,
          companyId: user.companyId,
          items: {
            create: dto.products.map(({ productId, quantity }) => ({
              productId,
              quantity,
            })),
          },
        },
        include: { items: true },
      });

      return exportRecord;
    });
  }
}
