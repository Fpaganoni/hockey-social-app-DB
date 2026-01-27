import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { CloudinaryService } from "../integrations/cloudinary.service";
import { PrismaService } from "../prisma.service";

@Resolver("User")
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private cloudinary: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  @Mutation(() => String)
  async register(
    @Args("email") email: string,
    @Args("name") name: string,
    @Args("username", { nullable: true }) username?: string,
    @Args("password") password?: string,
    @Args("role", { nullable: true }) role?: string,
  ) {
    try {
      // Normalize role to uppercase for case-insensitive validation
      const normalizedRole = role?.toUpperCase();

      // Validate role if provided
      if (
        normalizedRole &&
        !["PLAYER", "COACH", "CLUB_ADMIN"].includes(normalizedRole)
      ) {
        throw new Error(
          "Invalid role. Allowed roles: PLAYER, COACH, CLUB_ADMIN",
        );
      }

      const user = await this.usersService.createUser({
        email,
        name,
        username,
        password,
        role: normalizedRole,
      });
      const token = await this.authService.login(user);
      return token.access_token;
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error(`${error.meta.target[0]} already exists`);
      }
      throw error;
    }
  }

  @Mutation(() => String)
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error("Invalid credentials");
    const t = await this.authService.login(user);
    return t.access_token;
  }

  @Mutation(() => Boolean)
  async uploadAvatar(
    @Args("userId") userId: string,
    @Args("base64") base64: string,
  ) {
    try {
      // accepts a data-url or base64 string
      const res = await this.cloudinary.uploadBase64(base64, "avatars");
      await this.usersService.setAvatar(userId, res.secure_url || res.url);
      return true;
    } catch (error) {
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }
  }

  @Query(() => Object)
  async me(@Args("id") id: string) {
    return this.usersService.findById(id);
  }

  @Query(() => [Object])
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => Object, { nullable: true })
  async user(@Args("id") id: string) {
    return this.usersService.findById(id);
  }

  @Query(() => [Object])
  async players() {
    return this.usersService.findByRole("PLAYER");
  }

  @Query(() => [Object])
  async coaches() {
    return this.usersService.findByRole("COACH");
  }

  @Mutation(() => Object)
  async updateUser(
    @Args("id") id: string,
    @Args("name", { nullable: true }) name?: string,
    @Args("bio", { nullable: true }) bio?: string,
    @Args("avatar", { nullable: true }) avatar?: string,
    @Args("coverImage", { nullable: true }) coverImage?: string,
    @Args("position", { nullable: true }) position?: string,
    @Args("country", { nullable: true }) country?: string,
    @Args("city", { nullable: true }) city?: string,
    @Args("clubId", { nullable: true }) clubId?: string,
    @Args("yearsOfExperience", { nullable: true }) yearsOfExperience?: number,
  ) {
    return this.usersService.updateUser(id, {
      name,
      bio,
      avatar,
      coverImage,
      position,
      country,
      city,
      clubId,
      yearsOfExperience,
    });
  }

  // Field resolver for statistics - returns aggregated career stats
  @ResolveField()
  async statistics(@Parent() user: any) {
    const { id } = user;

    // Get the "Career" statistics record which contains aggregated totals
    const careerStats = await this.prisma.statistics.findFirst({
      where: {
        userId: id,
        season: "Career",
      },
      include: { club: true },
    });

    return careerStats;
  }

  // Field resolver for trajectories
  @ResolveField()
  async trajectories(@Parent() user: any) {
    const { id } = user;
    return this.prisma.trajectory.findMany({
      where: { userId: id },
      include: { club: true },
      orderBy: { order: "asc" },
    });
  }
}
