import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CloudinaryService } from '../integrations/cloudinary.service';

@Resolver('User')
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private cloudinary: CloudinaryService,
  ) {}

  @Mutation(() => String)
  async register(@Args('email') email: string, @Args('username') username: string, @Args('password') password: string) {
    const user = await this.usersService.createUser({ email, username, password });
    const token = await this.authService.login(user);
    return token.access_token;
  }

  @Mutation(() => String)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    const t = await this.authService.login(user);
    return t.access_token;
  }

  @Mutation(() => Boolean)
  async uploadAvatar(@Args('userId') userId: string, @Args('base64') base64: string) {
    // accepts a data-url or base64 string
    const res = await this.cloudinary.uploadBase64(base64, 'avatars');
    await this.usersService.setAvatar(userId, res.secure_url || res.url);
    return true;
  }

  @Query(() => Object)
  async me(@Args('id') id: string) {
    return this.usersService.findById(id);
  }
}
