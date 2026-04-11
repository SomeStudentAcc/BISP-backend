import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll() {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  public async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  public async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  public async create(dto: AuthDto) {
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: await hash(dto.password),
        company: {
          connect: {
            id: dto.companyId, // Connect to the default company
          },
        },
      },
    });

    return user;
  }
}
