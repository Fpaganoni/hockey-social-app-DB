import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TeamsService, TeamsResolver, PrismaService],
  exports: [TeamsService],
})
export class TeamsModule {}
