import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const userId = (req.session as any)?.userId;

        if (userId) {
            const user = await this.authService.validateUser(userId);
            (req as any).user = user;
        }

        next();
    }
}
