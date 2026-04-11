import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  public constructor(private readonly prismaService: PrismaService) {}

  async getAllCompanies() {
    const companies = await this.prismaService.company.findMany();
    return companies;
  }

  async createCompany(dto: CreateCompanyDto) {
    const company = await this.prismaService.company.create({
      data: {
        name: dto.name,
        ...(dto.logo && { logo: dto.logo }),
      },
    });
    return company;
  }
}
