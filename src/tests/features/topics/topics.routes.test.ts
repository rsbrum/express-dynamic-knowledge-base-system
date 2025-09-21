import { TopicsRoutes } from '@/features/topics/topics.routes';
import { TopicsService } from '@/features/topics/topics.service';
import { TopicsController } from '@/features/topics/topics.controller';
import { TopicsRepository } from '@/features/topics/topics.repository';
import { ResourcesRepository } from '@/features/resources/resources.repository';
import { TopicVersionsRepository } from '@/features/topics/topic-versions/topic-version.repository';
import { TopicVersionService } from '@/features/topics/topic-versions/topic-version.service';
import { AuthMiddleware } from '@/core/middlewares/auth.middleware';
import { PermissionsMiddleware } from '@/core/middlewares/permissions.middleware';
import { EUserPermissions } from '@/lib/EUserPermissions';
import { EUserRole } from '@/lib/EUserRole';
import { Request, Response } from 'express';
import { mockUser } from '@/tests/mockData';

jest.mock('@/features/topics/topics.service');
jest.mock('@/features/topics/topics.controller');
jest.mock('@/features/topics/topics.repository');
jest.mock('@/features/resources/resources.repository');
jest.mock('@/features/topics/topic-versions/topic-version.repository');
jest.mock('@/features/topics/topic-versions/topic-version.service');
jest.mock('@/core/middlewares/auth.middleware');
jest.mock('@/core/middlewares/permissions.middleware');
jest.mock('@/core/logger');

describe('TopicsRoutes', () => {
  let topicsRoutes: TopicsRoutes;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      headers: { 'x-user-role': EUserRole.ADMIN },
      params: {},
      body: {},
      user: mockUser
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    (AuthMiddleware.authenticate as jest.Mock) = jest.fn((req, res, next) => next());
    (PermissionsMiddleware.attachPermissions as jest.Mock) = jest.fn((req, res, next) => next());
    (PermissionsMiddleware.requirePermission as jest.Mock) = jest.fn(() => (req: Request, res: Response, next: any) => next());

    topicsRoutes = new TopicsRoutes();
  });

  describe('initializeDependencies', () => {
    it('should initialize dependencies', () => {
      const router = topicsRoutes.getRouter();

      expect(router).toBeDefined();
      expect(TopicsRepository).toHaveBeenCalledTimes(1);
      expect(TopicVersionsRepository).toHaveBeenCalledTimes(1);
      expect(ResourcesRepository).toHaveBeenCalledTimes(1);
      expect(TopicVersionService).toHaveBeenCalledTimes(1);
      expect(TopicsService).toHaveBeenCalledTimes(1);
      expect(TopicsController).toHaveBeenCalledTimes(1);
    });
  });

  describe('middleware', () => {
    beforeEach(() => {
      topicsRoutes.getRouter();
    });

    it('should require CAN_VIEW permission for GET routes', () => {
      expect(PermissionsMiddleware.requirePermission).toHaveBeenCalledWith(EUserPermissions.CAN_VIEW);
    });

    it('should require CAN_EDIT permission for POST and PUT routes', () => {
      expect(PermissionsMiddleware.requirePermission).toHaveBeenCalledWith(EUserPermissions.CAN_EDIT);
    });

    it('should require CAN_DELETE permission for DELETE routes', () => {
      expect(PermissionsMiddleware.requirePermission).toHaveBeenCalledWith(EUserPermissions.CAN_DELETE);
    });

  });

  describe('dependency injection', () => {
    it('should inject TopicsRepository in TopicVersionService', () => {
      topicsRoutes.getRouter();

      expect(TopicVersionService).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should inject all repositories in TopicsService', () => {
      topicsRoutes.getRouter();

      expect(TopicsService).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('should inject TopicsService into TopicsController', () => {
      topicsRoutes.getRouter();

      expect(TopicsController).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('registerRoutes', () => {
    beforeEach(() => {
      topicsRoutes.getRouter();
    });

    it('should have appropriate permission requirements for each route type', () => {
      const requirePermissionCalls = (PermissionsMiddleware.requirePermission as jest.Mock).mock.calls;

      expect(requirePermissionCalls).toContainEqual([EUserPermissions.CAN_VIEW]);
      expect(requirePermissionCalls).toContainEqual([EUserPermissions.CAN_EDIT]);
      expect(requirePermissionCalls).toContainEqual([EUserPermissions.CAN_DELETE]);
    });

    it('should require proper permissions for read operations', () => {
      expect(PermissionsMiddleware.requirePermission).toHaveBeenCalledWith(EUserPermissions.CAN_VIEW);
    });

    it('should require proper permissions for write operations', () => {
      expect(PermissionsMiddleware.requirePermission).toHaveBeenCalledWith(EUserPermissions.CAN_EDIT);
    });

    it('should require proper permissions for delete operations', () => {
      expect(PermissionsMiddleware.requirePermission).toHaveBeenCalledWith(EUserPermissions.CAN_DELETE);
    });
  });



});
