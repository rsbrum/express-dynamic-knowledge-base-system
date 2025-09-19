import { Request, Response, NextFunction } from 'express';
import { User } from '@/features/users/user.entity';
import { PermissionsStrategyFactory } from '@/core/permissions/permissions.factory';
import { PermissionsStrategy } from '@/core/permissions/permissions.strategy';
import { EUserPermissions } from '@/lib/EUserPermissions';
import Logger from '@/core/logger';
import { ErrorResponse } from '@/lib/ErrorResponse';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      permissions?: PermissionsStrategy;
      hasPermission?: (permission: EUserPermissions) => boolean;
    }
  }
}

export class PermissionsMiddleware {
  private static logger = new Logger(PermissionsMiddleware.name);


  static attachPermissions(req: Request, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        PermissionsMiddleware.logger.warn('No user found on request, skipping permissions');
				ErrorResponse.internal('Internal server error', 'Not authenticated').send(res, 500);
        return;
      }

      const permissionsStrategy = PermissionsStrategyFactory.getStrategy(req.user.role);

      req.permissions = permissionsStrategy;

      req.hasPermission = (permission: EUserPermissions): boolean => {
        return permissionsStrategy.canPerform(permission);
      };

      PermissionsMiddleware.logger.log(`Permissions attached for user ${req.user.id} with role ${req.user.role}`);
      next();
    } catch (error) {
      PermissionsMiddleware.logger.error('Error attaching permissions', error as string);
			ErrorResponse.internal('Internal server error', 'Failed to process user permissions').send(res, 500);
      return;
    }
  };

  static requirePermission (permission: EUserPermissions) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (!req.hasPermission) {
          PermissionsMiddleware.logger.warn('Permissions not found on request');
					ErrorResponse.internal('Internal server error', 'Permissions not properly configured').send(res, 500);
          return;
        }

        if (!req.hasPermission(permission)) {
          PermissionsMiddleware.logger.warn(`User ${req.user?.id} denied access - missing permission: ${permission}`);
					ErrorResponse.badRequest('Forbidden', 'You don\'t have permission to perform this action').send(res, 403);
          return;
        }

        PermissionsMiddleware.logger.log(`User ${req.user?.id} granted access with permission: ${permission}`);
        next();
      } catch (error) {
        PermissionsMiddleware.logger.error('Error checking permissions', error as string);
				ErrorResponse.internal('Internal server error', 'Failed to verify permissions').send(res, 500);
        return;
      }
    };
  };
}
