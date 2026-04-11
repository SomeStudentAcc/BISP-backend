import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class ExportsService {
  public constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string, user: UserPayload) {
    const exportItem = await this.prismaService.export.findUnique({
      where: {
        companyId: user.companyId,
        id,
      },
      include: {
        diller: true,
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return exportItem;
  }
}
