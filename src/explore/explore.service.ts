import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

export interface ExploreFilters {
  role?: string;
  country?: string;
  position?: string;
  league?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class ExploreService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get filtered users for explore page
   * Returns active users with role filtering, search, and pagination
   */
  async getExploreUsers(filters: ExploreFilters) {
    const { role, country, position, search, limit = 50, offset = 0 } = filters;

    const where: any = {
      isActive: true, // Only show active users
    };

    // Role filter
    if (role) {
      where.role = role;
    }

    // Country filter
    if (country) {
      where.country = country;
    }

    // Position filter
    if (position) {
      where.position = position;
    }

    // Search filter (searches name, username, city, bio)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      orderBy: [
        { isVerified: "desc" }, // Verified users first
        { createdAt: "desc" }, // Then newest first
      ],
      take: limit,
      skip: offset,
      include: {
        club: true, // Include current club info
      },
    });
  }

  /**
   * Get filtered clubs for explore page
   * Returns clubs with league/country filtering and search
   */
  async getExploreClubs(filters: ExploreFilters) {
    const { country, league, search, limit = 50, offset = 0 } = filters;

    const where: any = {};

    // Country filter
    if (country) {
      where.country = country;
    }

    // League filter
    if (league) {
      where.league = league;
    }

    // Search filter (searches name, city, description, bio)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    return this.prisma.club.findMany({
      where,
      orderBy: [
        { isVerified: "desc" }, // Verified clubs first
        { createdAt: "desc" }, // Then newest first
      ],
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get all available positions (for filter dropdown)
   */
  async getAvailablePositions() {
    const positions = await this.prisma.user.findMany({
      where: {
        position: { not: null },
        isActive: true,
      },
      select: {
        position: true,
      },
      distinct: ["position"],
    });

    return positions
      .map((p) => p.position)
      .filter((p) => p !== null)
      .sort();
  }

  /**
   * Get all available leagues (for filter dropdown)
   */
  async getAvailableLeagues() {
    const leagues = await this.prisma.club.findMany({
      where: {
        league: { not: null },
      },
      select: {
        league: true,
      },
      distinct: ["league"],
    });

    return leagues
      .map((l) => l.league)
      .filter((l) => l !== null)
      .sort();
  }

  /**
   * Get all available countries (for filter dropdown)
   */
  async getAvailableCountries() {
    // Get countries from both users and clubs
    const userCountries = await this.prisma.user.findMany({
      where: {
        country: { not: null },
        isActive: true,
      },
      select: {
        country: true,
      },
      distinct: ["country"],
    });

    const clubCountries = await this.prisma.club.findMany({
      where: {
        country: { not: null },
      },
      select: {
        country: true,
      },
      distinct: ["country"],
    });

    const allCountries = new Set([
      ...userCountries.map((c) => c.country),
      ...clubCountries.map((c) => c.country),
    ]);

    return Array.from(allCountries)
      .filter((c) => c !== null)
      .sort();
  }
}
