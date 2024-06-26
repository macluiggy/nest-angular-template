import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import envVariables from '../../common/envVariables';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  jwtService = new JwtService();
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // Add your JWT validation logic here
    return this.validateRequest(request);
  }
  //
  validateRequest(request: any): boolean {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const user = this.jwtService.verify(token, {
        secret: envVariables.jwtSecret,
      });

      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
