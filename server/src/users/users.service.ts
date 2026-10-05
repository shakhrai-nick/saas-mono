import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma.service.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {

  constructor (private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: dto.password,
        name: dto.email
      },
      omit: {
        passwordHash: true
      }
    });
    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      },
      omit: {
        passwordHash: true
      }
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      },
      omit: {
        passwordHash: true
      }
    });

    return user;
  }

  async findCredentials(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    });

    return user;
  }

  async updatePasswordHash(userId: string, newHash: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: newHash
      }
    });
  }

  async verifyEmail(userId: string, email: string): Promise<boolean> {
    const user = this.prisma.user.update({
      where: {
        id: userId,
        email: email
      },
      data: {
        emailVerified: true
      }
    });

    return await user ? true : false;
  }

}