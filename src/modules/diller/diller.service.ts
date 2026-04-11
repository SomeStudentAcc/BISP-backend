import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPayload } from '../auth/strategies/jwt.strategy';
import { CreateDillerDto } from './dto/create-diller.dto';
import { hash } from 'argon2';

@Injectable()
export class DillerService {
  public constructor(private readonly prismaService: PrismaService) {}

  async getAll(user: UserPayload) {
    const dillers = await this.prismaService.diller.findMany({
      where: {
        companyId: user.companyId,
      },
    });

    return dillers;
  }

  async getMe(user: UserPayload) {
    const diller = await this.prismaService.diller.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            createdAt: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!diller) {
      throw new NotFoundException('Diller profile not found');
    }

    return diller;
  }

  async getById(id: string, user: UserPayload) {
    const diller = await this.prismaService.diller.findUnique({
      where: {
        id,
        companyId: user.companyId,
      },
      include: {
        user: true,
      },
    });

    return diller;
  }

  async create(dto: CreateDillerDto, user: UserPayload) {
    const userAccount = await this.prismaService.user.create({
      data: {
        username: dto.name,
        password: await hash(dto.password),
        email: dto.email,
        role: 'DILLER', // ✅ important
        company: {
          connect: {
            id: user.companyId,
          },
        },
      },
    });

    if (userAccount) {
      const diller = await this.prismaService.diller.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          company: {
            connect: { id: user.companyId },
          },
          user: {
            connect: { id: userAccount.id },
          },
        },
      });

      return diller;
    }
  }

  async update(id: string, dto: CreateDillerDto, user: UserPayload) {
    const existing = await this.prismaService.diller.findUnique({
      where: { id, companyId: user.companyId },
      select: { userId: true },
    });

    // Update linked user separately
    if (existing?.userId) {
      await this.prismaService.user.update({
        where: { id: existing.userId },
        data: {
          username: dto.name,
          email: dto.email,
          ...(dto.password && { password: await hash(dto.password) }),
        },
      });
    }

    // Update diller with scalars only
    const diller = await this.prismaService.diller.update({
      where: {
        id,
        companyId: user.companyId,
      },
      data: {
        name: dto.name,
        phone: dto.phone,
        companyId: user.companyId,
      },
    });

    return diller;
  }

  async delete(id: string, user: UserPayload) {
    const existing = await this.prismaService.diller.findUnique({
      where: { id, companyId: user.companyId },
      select: { userId: true },
    });

    if (!existing) throw new NotFoundException('Diller not found');

    // 1. Delete exports (and their items via cascade) tied to this diller user
    await this.prismaService.export.deleteMany({
      where: {
        dillerUserId: existing.userId,
        companyId: user.companyId,
      },
    });

    // 2. Delete diller
    const diller = await this.prismaService.diller.delete({
      where: { id, companyId: user.companyId },
    });

    // 3. Now safe to delete user
    await this.prismaService.user.delete({
      where: { id: existing.userId },
    });

    return diller;
  }

  async getDillerInventory(dillerId: string, user: UserPayload) {
    const diller = await this.prismaService.diller.findFirst({
      where: { id: dillerId, companyId: user.companyId },
    });

    if (!diller) throw new NotFoundException('Diller not found');

    const exports = await this.prismaService.export.findMany({
      where: { dillerUserId: diller.userId, companyId: user.companyId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                characteristics: true,
              },
            },
          },
        },
      },
    });

    // Group and sum quantities by product
    const inventoryMap = exports
      .flatMap((e) => e.items)
      .reduce(
        (acc, item) => {
          if (acc[item.productId]) {
            acc[item.productId].quantity += item.quantity;
          } else {
            acc[item.productId] = {
              product: item.product,
              quantity: item.quantity,
            };
          }
          return acc;
        },
        {} as Record<string, { product: any; quantity: number }>,
      );

    return Object.values(inventoryMap);
  }

  async getDillerExports(dillerId: string, user: UserPayload) {
    const diller = await this.prismaService.diller.findFirst({
      where: { id: dillerId, companyId: user.companyId },
    });

    if (!diller) throw new NotFoundException('Diller not found');

    const exports = await this.prismaService.export.findMany({
      where: {
        dillerUserId: diller.userId,
        companyId: user.companyId,
      },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return exports;
  }
}
