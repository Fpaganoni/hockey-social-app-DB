import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { PrismaService } from '../prisma.service';
import { MarketplaceResolver } from './marketplace.resolver';

@Module({
  providers: [MarketplaceService, PrismaService, MarketplaceResolver],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
