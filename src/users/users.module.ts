import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../prisma.service';
import { CloudinaryService } from '../integrations/cloudinary.service';

@Module({
  providers: [UsersService, UsersResolver, PrismaService, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}
