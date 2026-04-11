import { Test, TestingModule } from "@nestjs/testing";
import { MessagingService } from "./messaging.service";
import { PrismaService } from "../prisma.service";

const mockPrismaService = {
  conversation: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  message: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe("MessagingService", () => {
  let service: MessagingService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  // ── getConversations ──────────────────────────────────────────────────────
  describe("getConversations", () => {
    it("should return conversations where user is a participant", async () => {
      const mockConvs = [{ id: "conv-1", participants: [], messages: [] }];
      prisma.conversation.findMany.mockResolvedValue(mockConvs);

      const result = await service.getConversations("user-1");

      expect(prisma.conversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { participants: { some: { id: "user-1" } } },
        })
      );
      expect(result).toEqual(mockConvs);
    });
  });

  // ── startConversation ─────────────────────────────────────────────────────
  describe("startConversation", () => {
    it("should return existing conversation without creating a new one", async () => {
      // Deduplication logic: re-opening a chat must not create duplicate conversations
      const existingConv = { id: "conv-existing", participants: [] };
      prisma.conversation.findFirst.mockResolvedValue(existingConv);

      const result = await service.startConversation(["user-1", "user-2"]);

      expect(prisma.conversation.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingConv);
    });

    it("should create a new conversation when none exists between participants", async () => {
      prisma.conversation.findFirst.mockResolvedValue(null);
      const newConv = { id: "conv-new", participants: [] };
      prisma.conversation.create.mockResolvedValue(newConv);

      const result = await service.startConversation(["user-1", "user-2"]);

      expect(prisma.conversation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            participants: {
              connect: [{ id: "user-1" }, { id: "user-2" }],
            },
          },
        })
      );
      expect(result).toEqual(newConv);
    });

    it("should build AND condition with all participant IDs for findFirst", async () => {
      // Ensures conversation lookup requires ALL participants, not just any
      prisma.conversation.findFirst.mockResolvedValue(null);
      prisma.conversation.create.mockResolvedValue({ id: "conv-new" });

      await service.startConversation(["user-A", "user-B", "user-C"]);

      const whereClause = prisma.conversation.findFirst.mock.calls[0][0].where;
      expect(whereClause.AND).toHaveLength(3);
      expect(whereClause.AND[0]).toEqual({ participants: { some: { id: "user-A" } } });
    });
  });

  // ── sendMessage ───────────────────────────────────────────────────────────
  describe("sendMessage", () => {
    it("should create message and update conversation updatedAt", async () => {
      const mockMessage = { id: "msg-1", content: "Hello!", sender: {} };
      prisma.message.create.mockResolvedValue(mockMessage);
      prisma.conversation.update.mockResolvedValue({});

      const result = await service.sendMessage("conv-1", "user-1", "Hello!");

      expect(prisma.message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { conversationId: "conv-1", senderId: "user-1", content: "Hello!" },
        })
      );
      // Conversation must be "touched" so it sorts to top of list
      expect(prisma.conversation.update).toHaveBeenCalledWith({
        where: { id: "conv-1" },
        data: { updatedAt: expect.any(Date) },
      });
      expect(result).toEqual(mockMessage);
    });
  });

  // ── markAsRead ────────────────────────────────────────────────────────────
  describe("markAsRead", () => {
    it("should mark a message as read and return true", async () => {
      prisma.message.update.mockResolvedValue({});

      const result = await service.markAsRead("msg-1");

      expect(prisma.message.update).toHaveBeenCalledWith({
        where: { id: "msg-1" },
        data: { isRead: true },
      });
      expect(result).toBe(true);
    });
  });

  // ── getMessages ───────────────────────────────────────────────────────────
  describe("getMessages", () => {
    it("should return messages in ascending order (oldest first)", async () => {
      const mockMessages = [{ id: "msg-1" }, { id: "msg-2" }];
      prisma.message.findMany.mockResolvedValue(mockMessages);

      const result = await service.getMessages("conv-1");

      expect(prisma.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { conversationId: "conv-1" },
          orderBy: { createdAt: "asc" },
        })
      );
      expect(result).toEqual(mockMessages);
    });
  });
});
