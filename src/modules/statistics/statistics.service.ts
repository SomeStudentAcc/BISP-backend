import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStatistics(user: UserPayload) {
    const [
      totalProducts,
      totalWarehouses,
      totalDillers,
      totalExports,
      totalExportItems,
      products,
      exports,
    ] = await Promise.all([
      // Counts
      this.prismaService.product.count({
        where: { companyId: user.companyId },
      }),
      this.prismaService.warehouse.count({
        where: { companyId: user.companyId },
      }),
      this.prismaService.diller.count({
        where: { companyId: user.companyId },
      }),
      this.prismaService.export.count({
        where: { companyId: user.companyId },
      }),

      // Total items exported across all exports
      this.prismaService.exportItem.aggregate({
        where: {
          export: { companyId: user.companyId },
        },
        _sum: { quantity: true },
      }),

      // Total quantity across all warehouse products
      this.prismaService.product.findMany({
        where: { companyId: user.companyId },
        select: { totalQuantity: true },
      }),

      // Exports per month (last 6 months)
      this.prismaService.export.findMany({
        where: {
          companyId: user.companyId,
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
        select: { createdAt: true },
      }),
    ]);

    // Total stock across all products
    const totalStock = products.reduce((sum, p) => sum + p.totalQuantity, 0);

    // Exports grouped by month
    const exportsByMonth = exports.reduce(
      (acc, e) => {
        const month = e.createdAt.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      counts: {
        totalProducts,
        totalWarehouses,
        totalDillers,
        totalExports,
      },
      stock: {
        totalStock,
        totalExported: totalExportItems._sum.quantity ?? 0,
      },
      exportsByMonth,
    };
  }
}
