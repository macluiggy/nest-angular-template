import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class DeleteDummyUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // Check if the user's name is "John Doe"

    if (req.body && req.body['email'] === 'johndoe@mail.com') {
      // Delete the user here
      // Your code to delete the user goes here
      const email = req.body['email'];
      await this.userService.deleteByEmail(email);
    }

    next();
  }
}
