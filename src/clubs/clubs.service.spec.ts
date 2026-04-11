import { Test, TestingModule } from "@nestjs/testing";
import { ClubsService } from "./clubs.service";
import { PrismaService } from "../prisma.service";

const mockPrismaService = {
  club: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  clubMember: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe("ClubsService", () => {
  let service: ClubsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  // ── findAll ───────────────────────────────────────────────────────────────
  describe("findAll", () => {
    it("should return all clubs including their teams", async () => {
      const mockClubs = [{ id: "club-1", name: "HC Barcelona", teams: [] }];
      prisma.club.findMany.mockResolvedValue(mockClubs);

      const result = await service.findAll();

      expect(prisma.club.findMany).toHaveBeenCalledWith({ include: { teams: true } });
      expect(result).toEqual(mockClubs);
    });
  });

  // ── create ────────────────────────────────────────────────────────────────
  describe("create", () => {
    it("should create a club with required fields", async () => {
      const input = { name: "HC Madrid", city: "Madrid", country: "Spain" };
      const mockClub = { id: "club-2", ...input };
      prisma.club.create.mockResolvedValue(mockClub);

      const result = await service.create(input);

      expect(prisma.club.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(mockClub);
    });

    it("should create a club with optional location", async () => {
      const input = { name: "HC Valencia", city: "Valencia", country: "Spain", location: "Polideportivo Norte" };
      prisma.club.create.mockResolvedValue({ id: "club-3", ...input });

      await service.create(input);

      const callData = prisma.club.create.mock.calls[0][0].data;
      expect(callData.location).toBe("Polideportivo Norte");
    });
  });

  // ── inviteMember ──────────────────────────────────────────────────────────
  describe("inviteMember", () => {
    it("should create a PENDING membership invitation", async () => {
      const mockMember = { id: "member-1", clubId: "club-1", userId: "user-1", status: "PENDING" };
      prisma.clubMember.findFirst.mockResolvedValue(null); // user not a member yet
      prisma.clubMember.create.mockResolvedValue(mockMember);

      const result = await service.inviteMember("club-1", "user-1", "admin-1");

      expect(prisma.clubMember.create).toHaveBeenCalledWith({
        data: { clubId: "club-1", userId: "user-1", invitedById: "admin-1", status: "PENDING" },
      });
      expect(result).toEqual(mockMember);
    });

    it("should throw if user is already a member", async () => {
      // Guard against duplicate membership rows — data integrity check
      prisma.clubMember.findFirst.mockResolvedValue({ id: "member-existing" });

      await expect(service.inviteMember("club-1", "user-1", "admin-1")).rejects.toThrow(
        "User is already a member of this club"
      );
      expect(prisma.clubMember.create).not.toHaveBeenCalled();
    });
  });

  // ── acceptMembership ──────────────────────────────────────────────────────
  describe("acceptMembership", () => {
    it("should update membership status to ACTIVE", async () => {
      const mockMember = { id: "member-1", status: "ACTIVE" };
      prisma.clubMember.update.mockResolvedValue(mockMember);

      const result = await service.acceptMembership("member-1");

      expect(prisma.clubMember.update).toHaveBeenCalledWith({
        where: { id: "member-1" },
        data: { status: "ACTIVE" },
      });
      expect(result).toEqual(mockMember);
    });
  });
});
