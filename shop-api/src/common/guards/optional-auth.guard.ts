import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      return true;
    }

    try {
      const token = this.extractToken(authorization);
      if (!token) {
        throw new UnauthorizedException('Invalid Authorization header format.');
      }

      const user = await this.userService.findByToken(token);
      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  private extractToken(authorization: string): string | null {
    const parts = authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  }
}
