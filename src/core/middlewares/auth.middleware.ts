import { Request, Response, NextFunction } from 'express';
import { User } from '@/features/users/user.entity';
import Logger from '@/core/logger';
import { ErrorResponse } from '@/lib/ErrorResponse';
import { EUserRole } from '@/lib/EUserRole';

export class AuthMiddleware {
  private static logger = new Logger(AuthMiddleware.name);


  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.headers['x-user-role'] as string;

      if (!userRole) {
        AuthMiddleware.logger.warn('No x-user-role provided in headers');
				ErrorResponse.unauthorized('Unauthorized', 'User authentication required').send(res, 401);
        return;
      }

			// todo
			// get user from database
			const user = AuthMiddleware.getUser(userRole as EUserRole);

      if (!user) {
        AuthMiddleware.logger.warn(`User not found`);
        ErrorResponse.unauthorized('Unauthorized', 'User authentication required').send(res, 401);
        return;
      }

      req.user = user;
      AuthMiddleware.logger.log(`User ${user.id} authenticated successfully`);

      next();
    } catch (error) {
      AuthMiddleware.logger.error('Authentication error', error as string);
			ErrorResponse.internal('Internal server error', 'Authentication failed').send(res, 500);
    }
  };

	private static getUser(userRole: EUserRole): User {
		switch(userRole) {
			case EUserRole.ADMIN:
				return {
					id: 1,
					name: 'User Admin',
					role: EUserRole.ADMIN,
					email: 'admin@example.com',
					createdAt: new Date(),
					updatedAt: new Date()
				}
			case EUserRole.EDITOR:
				return {
					id: 2,
					name: 'User Editor',
					role: EUserRole.EDITOR,
					email: 'editor@example.com',
					createdAt: new Date(),
					updatedAt: new Date()
				};
			case EUserRole.VIEWER:
				return {
					id: 3,
					name: 'User Viewer',
					role: EUserRole.VIEWER,
					email: 'viewer@example.com',
					createdAt: new Date(),
					updatedAt: new Date()
				};
		}
	}
}
