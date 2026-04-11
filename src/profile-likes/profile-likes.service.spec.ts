import { Test, TestingModule } from "@nestjs/testing";
import { ProfileLikesService } from "./profile-likes.service";
import { PrismaService } from "../prisma.service";

const mockPrismaService = {
  profileLike: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe("ProfileLikesService", () => {
  let service: ProfileLikesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileLikesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProfileLikesService>(ProfileLikesService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  // ── likeProfile ───────────────────────────────────────────────────────────
  describe("likeProfile", () => {
    it("should create a profile like", async () => {
      const mockLike = { id: "like-1", likerType: "USER", likerId: "user-1" };
      prisma.profileLike.create.mockResolvedValue(mockLike);

      const result = await service.likeProfile("USER", "user-1", "USER", "user-2");

      expect(prisma.profileLike.create).toHaveBeenCalledWith({
        data: { likerType: "USER", likerId: "user-1", profileType: "USER", profileId: "user-2" },
      });
      expect(result).toEqual(mockLike);
    });

    it("should throw 'Already liked' on duplicate (P2002)", async () => {
      prisma.profileLike.create.mockRejectedValue({ code: "P2002" });

      await expect(service.likeProfile("USER", "user-1", "USER", "user-2")).rejects.toThrow(
        "Already liked this profile"
      );
    });

    it("should rethrow non-duplicate errors", async () => {
      prisma.profileLike.create.mockRejectedValue(new Error("Connection error"));
      await expect(service.likeProfile("USER", "user-1", "USER", "user-2")).rejects.toThrow(
        "Connection error"
      );
    });
  });

  // ── unlikeProfile ─────────────────────────────────────────────────────────
  describe("unlikeProfile", () => {
    it("should remove like and return true", async () => {
      const mockLike = { id: "like-1" };
      prisma.profileLike.findFirst.mockResolvedValue(mockLike);
      prisma.profileLike.delete.mockResolvedValue({});

      const result = await service.unlikeProfile("USER", "user-1", "USER", "user-2");

      expect(prisma.profileLike.delete).toHaveBeenCalledWith({ where: { id: "like-1" } });
      expect(result).toBe(true);
    });

    it("should throw 'Like not found' when like does not exist", async () => {
      prisma.profileLike.findFirst.mockResolvedValue(null);

      await expect(service.unlikeProfile("USER", "user-1", "USER", "user-99")).rejects.toThrow(
        "Like not found"
      );
      expect(prisma.profileLike.delete).not.toHaveBeenCalled();
    });
  });

  // ── hasLiked ──────────────────────────────────────────────────────────────
  describe("hasLiked", () => {
    it("should return true when like exists", async () => {
      prisma.profileLike.findFirst.mockResolvedValue({ id: "like-1" });
      expect(await service.hasLiked("USER", "user-1", "USER", "user-2")).toBe(true);
    });

    it("should return false when no like exists", async () => {
      prisma.profileLike.findFirst.mockResolvedValue(null);
      expect(await service.hasLiked("USER", "user-1", "USER", "user-2")).toBe(false);
    });
  });

  // ── getProfileLikesCount ──────────────────────────────────────────────────
  describe("getProfileLikesCount", () => {
    it("should return the total number of likes for a profile", async () => {
      prisma.profileLike.count.mockResolvedValue(88);

      const result = await service.getProfileLikesCount("USER", "user-1");

      expect(prisma.profileLike.count).toHaveBeenCalledWith({
        where: { profileType: "USER", profileId: "user-1" },
      });
      expect(result).toBe(88);
    });
  });

  // ── getLikedProfiles ──────────────────────────────────────────────────────
  describe("getLikedProfiles", () => {
    it("should return profiles liked by a user", async () => {
      const mockLikes = [{ id: "like-1", profileId: "user-2" }];
      prisma.profileLike.findMany.mockResolvedValue(mockLikes);

      const result = await service.getLikedProfiles("USER", "user-1");

      expect(prisma.profileLike.findMany).toHaveBeenCalledWith({
        where: { likerType: "USER", likerId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockLikes);
    });
  });
});
