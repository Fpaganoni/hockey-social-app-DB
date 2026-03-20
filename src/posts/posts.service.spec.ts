import { Test, TestingModule } from "@nestjs/testing";
import { PostsService } from "./posts.service";
import { PrismaService } from "../prisma.service";

const mockPrismaService = {
  post: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  comment: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  commentLike: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  like: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};

describe("PostsService", () => {
  let service: PostsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  // ── findAll ────────────────────────────────────────────────────────────────
  describe("findAll", () => {
    it("debería retornar lista de posts con límite por defecto (50)", async () => {
      const mockPosts = [{ id: "post-1", content: "Test post" }];
      prisma.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.findAll();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        take: 50,
        skip: 0,
        orderBy: { createdAt: "desc" },
        include: { user: true, club: true },
      });
      expect(result).toEqual(mockPosts);
    });

    it("debería respetar el límite y offset personalizados", async () => {
      prisma.post.findMany.mockResolvedValue([]);

      await service.findAll(10, 20);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10, skip: 20 })
      );
    });
  });

  // ── findById ───────────────────────────────────────────────────────────────
  describe("findById", () => {
    it("debería encontrar un post por ID", async () => {
      const mockPost = { id: "post-1", content: "Gol! 🎯" };
      prisma.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findById("post-1");

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: "post-1" },
        include: { user: true, club: true },
      });
      expect(result).toEqual(mockPost);
    });
  });

  // ── findByUser ─────────────────────────────────────────────────────────────
  describe("findByUser", () => {
    it("debería retornar los posts de un usuario específico", async () => {
      const mockPosts = [{ id: "post-1", userId: "user-1" }];
      prisma.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.findByUser("user-1");

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
        include: { user: true, club: true },
      });
      expect(result).toEqual(mockPosts);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe("create", () => {
    it("debería crear un post de usuario con visibilidad PUBLIC por defecto", async () => {
      const mockPost = { id: "post-new", content: "Entrenamiento hoy! 🏑" };
      prisma.post.create.mockResolvedValue(mockPost);

      const result = await service.create({
        content: "Entrenamiento hoy! 🏑",
        userId: "user-1",
        imageUrl: "https://cdn.com/img.jpg",
      });

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          content: "Entrenamiento hoy! 🏑",
          userId: "user-1",
          visibility: "PUBLIC",
          isClubPost: false,
          isPinned: false,
        }),
      });
      expect(result).toEqual(mockPost);
    });

    it("debería marcar isClubPost como true cuando se provee clubId", async () => {
      prisma.post.create.mockResolvedValue({ id: "post-club" });

      await service.create({
        content: "Anuncio del club",
        userId: "user-1",
        clubId: "club-1",
      });

      const callArg = prisma.post.create.mock.calls[0][0].data;
      expect(callArg.isClubPost).toBe(true);
      expect(callArg.clubId).toBe("club-1");
    });
  });

  // ── delete ─────────────────────────────────────────────────────────────────
  describe("delete", () => {
    it("debería eliminar un post y retornar true", async () => {
      prisma.post.delete.mockResolvedValue({});

      const result = await service.delete("post-1");

      expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: "post-1" } });
      expect(result).toBe(true);
    });
  });

  // ── likePost ───────────────────────────────────────────────────────────────
  describe("likePost", () => {
    it("debería dar like a un post exitosamente", async () => {
      const mockLike = { id: "like-1", postId: "post-1", userId: "user-1" };
      prisma.like.create.mockResolvedValue(mockLike);

      const result = await service.likePost("post-1", "user-1");

      expect(prisma.like.create).toHaveBeenCalledWith({
        data: { postId: "post-1", userId: "user-1" },
      });
      expect(result).toEqual(mockLike);
    });

    it("debería lanzar error si el usuario ya dio like", async () => {
      const duplicateError = { code: "P2002" };
      prisma.like.create.mockRejectedValue(duplicateError);

      await expect(service.likePost("post-1", "user-1")).rejects.toThrow(
        "You already liked this post"
      );
    });
  });

  // ── unlikePost ─────────────────────────────────────────────────────────────
  describe("unlikePost", () => {
    it("debería quitar el like exitosamente", async () => {
      const mockLike = { id: "like-1" };
      prisma.like.findFirst.mockResolvedValue(mockLike);
      prisma.like.delete.mockResolvedValue({});

      const result = await service.unlikePost("post-1", "user-1");

      expect(prisma.like.delete).toHaveBeenCalledWith({ where: { id: "like-1" } });
      expect(result).toBe(true);
    });

    it("debería lanzar error si el like no existe", async () => {
      prisma.like.findFirst.mockResolvedValue(null);

      await expect(service.unlikePost("post-1", "user-99")).rejects.toThrow("Like not found");
    });
  });

  // ── getLikesCount ──────────────────────────────────────────────────────────
  describe("getLikesCount", () => {
    it("debería retornar el conteo de likes de un post", async () => {
      prisma.like.count.mockResolvedValue(42);

      const result = await service.getLikesCount("post-1");

      expect(prisma.like.count).toHaveBeenCalledWith({ where: { postId: "post-1" } });
      expect(result).toBe(42);
    });
  });

  // ── createComment ──────────────────────────────────────────────────────────
  describe("createComment", () => {
    it("debería crear un comentario en un post", async () => {
      const mockComment = { id: "comment-1", content: "Increíble! 🔥" };
      prisma.comment.create.mockResolvedValue(mockComment);

      const result = await service.createComment("post-1", "user-1", "Increíble! 🔥");

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          postId: "post-1",
          userId: "user-1",
          content: "Increíble! 🔥",
          parentCommentId: undefined,
        },
        include: { user: true },
      });
      expect(result).toEqual(mockComment);
    });
  });
});
