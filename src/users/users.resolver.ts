import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { CloudinaryService } from "../integrations/cloudinary.service";

@Resolver("User")
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private cloudinary: CloudinaryService
  ) {}

  @Mutation(() => String)
  async register(
    @Args("email") email: string,
    @Args("username") username: string,
    @Args("password") password: string
  ) {
    try {
      const user = await this.usersService.createUser({
        email,
        username,
        password,
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
    @Args("password") password: string
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error("Invalid credentials");
    const t = await this.authService.login(user);
    return t.access_token;
  }

  @Mutation(() => Boolean)
  async uploadAvatar(
    @Args("userId") userId: string,
    @Args("base64") base64: string
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
}
