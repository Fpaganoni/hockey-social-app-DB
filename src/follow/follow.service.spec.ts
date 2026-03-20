import { Test, TestingModule } from "@nestjs/testing";
import { FollowService } from "./follow.service";
import { PrismaService } from "../prisma.service";

const mockPrismaService = {
  follow: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe("FollowService", () => {
  let service: FollowService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  // ── follow ─────────────────────────────────────────────────────────────────
  describe("follow", () => {
    it("debería crear un follow entre dos usuarios", async () => {
      const mockFollow = {
        id: "follow-1",
        followerType: "USER",
        followerId: "user-1",
        followingType: "USER",
        followingId: "user-2",
      };
      prisma.follow.create.mockResolvedValue(mockFollow);

      const result = await service.follow("USER", "user-1", "USER", "user-2");

      expect(prisma.follow.create).toHaveBeenCalledWith({
        data: {
          followerType: "USER",
          followerId: "user-1",
          followingType: "USER",
          followingId: "user-2",
        },
      });
      expect(result).toEqual(mockFollow);
    });

    it("debería crear un follow de usuario a club", async () => {
      prisma.follow.create.mockResolvedValue({ id: "follow-2" });

      await service.follow("USER", "user-1", "CLUB", "club-1");

      expect(prisma.follow.create).toHaveBeenCalledWith({
        data: {
          followerType: "USER",
          followerId: "user-1",
          followingType: "CLUB",
          followingId: "club-1",
        },
      });
    });

    it("debería lanzar error 'Already following' si ya sigue al usuario", async () => {
      prisma.follow.create.mockRejectedValue({ code: "P2002" });

      await expect(service.follow("USER", "user-1", "USER", "user-2")).rejects.toThrow(
        "Already following"
      );
    });

    it("debería re-lanzar errores no relacionados con duplicados", async () => {
      prisma.follow.create.mockRejectedValue(new Error("DB connection error"));

      await expect(service.follow("USER", "user-1", "USER", "user-2")).rejects.toThrow(
        "DB connection error"
      );
    });
  });

  // ── unfollow ───────────────────────────────────────────────────────────────
  describe("unfollow", () => {
    it("debería eliminar un follow existente y retornar true", async () => {
      const mockFollow = { id: "follow-1" };
      prisma.follow.findFirst.mockResolvedValue(mockFollow);
      prisma.follow.delete.mockResolvedValue({});

      const result = await service.unfollow("USER", "user-1", "USER", "user-2");

      expect(prisma.follow.delete).toHaveBeenCalledWith({ where: { id: "follow-1" } });
      expect(result).toBe(true);
    });

    it("debería lanzar error 'Not following' si la relación no existe", async () => {
      prisma.follow.findFirst.mockResolvedValue(null);

      await expect(service.unfollow("USER", "user-1", "USER", "user-999")).rejects.toThrow(
        "Not following"
      );
      expect(prisma.follow.delete).not.toHaveBeenCalled();
    });
  });

  // ── getFollowers ───────────────────────────────────────────────────────────
  describe("getFollowers", () => {
    it("debería retornar los seguidores de un usuario", async () => {
      const mockFollowers = [{ id: "follow-1", followerId: "user-2" }];
      prisma.follow.findMany.mockResolvedValue(mockFollowers);

      const result = await service.getFollowers("USER", "user-1");

      expect(prisma.follow.findMany).toHaveBeenCalledWith({
        where: { followingType: "USER", followingId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockFollowers);
    });
  });

  // ── getFollowing ───────────────────────────────────────────────────────────
  describe("getFollowing", () => {
    it("debería retornar a quiénes sigue un usuario", async () => {
      const mockFollowing = [{ id: "follow-1", followingId: "user-3" }];
      prisma.follow.findMany.mockResolvedValue(mockFollowing);

      const result = await service.getFollowing("USER", "user-1");

      expect(prisma.follow.findMany).toHaveBeenCalledWith({
        where: { followerType: "USER", followerId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockFollowing);
    });
  });

  // ── getFollowersCount ──────────────────────────────────────────────────────
  describe("getFollowersCount", () => {
    it("debería retornar el conteo de seguidores", async () => {
      prisma.follow.count.mockResolvedValue(25);

      const result = await service.getFollowersCount("USER", "user-1");

      expect(prisma.follow.count).toHaveBeenCalledWith({
        where: { followingType: "USER", followingId: "user-1" },
      });
      expect(result).toBe(25);
    });
  });

  // ── getFollowingCount ──────────────────────────────────────────────────────
  describe("getFollowingCount", () => {
    it("debería retornar el conteo de usuarios seguidos", async () => {
      prisma.follow.count.mockResolvedValue(10);

      const result = await service.getFollowingCount("USER", "user-1");

      expect(prisma.follow.count).toHaveBeenCalledWith({
        where: { followerType: "USER", followerId: "user-1" },
      });
      expect(result).toBe(10);
    });
  });
});
