import { Test, TestingModule } from "@nestjs/testing";
import { StoriesService } from "./stories.service";
import { PrismaService } from "../prisma.service";

const mockPrismaService = {
  follow: { findMany: jest.fn() },
  story: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  storyView: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe("StoriesService", () => {
  let service: StoriesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StoriesService>(StoriesService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  // ── getActiveStoriesFromFollowing ──────────────────────────────────────────
  describe("getActiveStoriesFromFollowing", () => {
    it("debería retornar stories activas de usuarios seguidos", async () => {
      const mockFollowing = [{ followingId: "user-2" }, { followingId: "user-3" }];
      const mockStories = [{ id: "story-1", userId: "user-2" }];

      prisma.follow.findMany.mockResolvedValue(mockFollowing);
      prisma.story.findMany.mockResolvedValue(mockStories);

      const result = await service.getActiveStoriesFromFollowing("user-1");

      expect(prisma.follow.findMany).toHaveBeenCalledWith({
        where: { followerType: "USER", followerId: "user-1", followingType: "USER" },
        select: { followingId: true },
      });
      expect(prisma.story.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: { in: ["user-2", "user-3"] },
            expiresAt: { gte: expect.any(Date) },
          },
        })
      );
      expect(result).toEqual(mockStories);
    });

    it("debería retornar array vacío si no sigue a nadie", async () => {
      prisma.follow.findMany.mockResolvedValue([]);
      prisma.story.findMany.mockResolvedValue([]);

      const result = await service.getActiveStoriesFromFollowing("user-1");

      expect(result).toEqual([]);
    });
  });

  // ── getUserStories ─────────────────────────────────────────────────────────
  describe("getUserStories", () => {
    it("debería retornar las stories activas de un usuario", async () => {
      const mockStories = [{ id: "story-1", userId: "user-1" }];
      prisma.story.findMany.mockResolvedValue(mockStories);

      const result = await service.getUserStories("user-1");

      expect(prisma.story.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: "user-1",
            expiresAt: { gte: expect.any(Date) },
          },
        })
      );
      expect(result).toEqual(mockStories);
    });
  });

  // ── createStory ────────────────────────────────────────────────────────────
  describe("createStory", () => {
    it("debería crear una story con imagen y texto", async () => {
      const mockStory = {
        id: "story-new",
        userId: "user-1",
        imageUrl: "https://cdn.com/img.jpg",
        text: "Entrenando! 💪",
      };
      prisma.story.create.mockResolvedValue(mockStory);

      const result = await service.createStory({
        userId: "user-1",
        imageUrl: "https://cdn.com/img.jpg",
        text: "Entrenando! 💪",
      });

      const callArg = prisma.story.create.mock.calls[0][0].data;
      expect(callArg.userId).toBe("user-1");
      expect(callArg.imageUrl).toBe("https://cdn.com/img.jpg");
      expect(callArg.text).toBe("Entrenando! 💪");
      // expiresAt debe ser ~24 horas en el futuro
      expect(callArg.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(result).toEqual(mockStory);
    });

    it("debería crear una story solo con texto", async () => {
      prisma.story.create.mockResolvedValue({ id: "story-text" });

      await service.createStory({ userId: "user-1", text: "Solo texto!" });

      const callArg = prisma.story.create.mock.calls[0][0].data;
      expect(callArg.imageUrl).toBeUndefined();
      expect(callArg.text).toBe("Solo texto!");
    });
  });

  // ── viewStory ──────────────────────────────────────────────────────────────
  describe("viewStory", () => {
    it("debería crear una nueva vista si el usuario no la vio antes", async () => {
      const mockView = { id: "view-1", storyId: "story-1", userId: "user-2" };

      prisma.storyView.findUnique.mockResolvedValue(null);
      prisma.storyView.create.mockResolvedValue(mockView);

      const result = await service.viewStory("story-1", "user-2");

      expect(prisma.storyView.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockView);
    });

    it("debería retornar la vista existente si el usuario ya la vio", async () => {
      const existingView = { id: "view-1", storyId: "story-1", userId: "user-2" };

      prisma.storyView.findUnique.mockResolvedValue(existingView);

      const result = await service.viewStory("story-1", "user-2");

      expect(prisma.storyView.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingView);
    });
  });

  // ── hasUserViewedStory ─────────────────────────────────────────────────────
  describe("hasUserViewedStory", () => {
    it("debería retornar true si el usuario ya vio la story", async () => {
      prisma.storyView.findUnique.mockResolvedValue({ id: "view-1" });
      const result = await service.hasUserViewedStory("story-1", "user-1");
      expect(result).toBe(true);
    });

    it("debería retornar false si el usuario no vio la story", async () => {
      prisma.storyView.findUnique.mockResolvedValue(null);
      const result = await service.hasUserViewedStory("story-1", "user-99");
      expect(result).toBe(false);
    });
  });

  // ── getViewsCount ──────────────────────────────────────────────────────────
  describe("getViewsCount", () => {
    it("debería retornar el total de vistas de una story", async () => {
      prisma.storyView.count.mockResolvedValue(15);

      const result = await service.getViewsCount("story-1");

      expect(prisma.storyView.count).toHaveBeenCalledWith({ where: { storyId: "story-1" } });
      expect(result).toBe(15);
    });
  });

  // ── deleteStory ────────────────────────────────────────────────────────────
  describe("deleteStory", () => {
    it("debería eliminar una story y retornar true", async () => {
      prisma.story.delete.mockResolvedValue({});

      const result = await service.deleteStory("story-1");

      expect(prisma.story.delete).toHaveBeenCalledWith({ where: { id: "story-1" } });
      expect(result).toBe(true);
    });
  });

  // ── getStoryById ───────────────────────────────────────────────────────────
  describe("getStoryById", () => {
    it("debería retornar una story por ID con sus vistas", async () => {
      const mockStory = { id: "story-1", views: [] };
      prisma.story.findUnique.mockResolvedValue(mockStory);

      const result = await service.getStoryById("story-1");

      expect(prisma.story.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "story-1" } })
      );
      expect(result).toEqual(mockStory);
    });
  });
});
