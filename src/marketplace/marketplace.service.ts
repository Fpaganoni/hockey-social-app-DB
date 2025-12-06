import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  listServices() {
    return this.prisma.service.findMany({ include: { provider: true } });
  }

  createService(data: any) {
    return this.prisma.service.create({ data });
  }
}
