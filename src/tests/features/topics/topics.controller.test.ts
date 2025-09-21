import { TopicsController } from '@/features/topics/topics.controller';
import { TopicsService } from '@/features/topics/topics.service';
import { Request, Response } from 'express';
import { z } from 'zod';
import { ErrorResponse } from '@/lib/ErrorResponse';
import { DataResponse } from '@/lib/PayloadResponse';
import { mockTopicVersion, mockHierarchicalTopics, topicPayload } from '@/tests/mockData';
import { TopicCreatePayloadSchema } from '@/lib/TopicCreatePayloadSchema';
import { TopicUpdatePayloadSchema } from '@/lib/TopicUpdatePayloadSchema';

jest.mock('@/features/topics/topics.service');
jest.mock('@/core/logger');
jest.mock('@/lib/TopicCreatePayloadSchema');
jest.mock('@/lib/TopicUpdatePayloadSchema');

describe('TopicsController', () => {
  let topicsController: TopicsController;
  let mockTopicsService: jest.Mocked<TopicsService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockErrorResponse: jest.Mocked<ErrorResponse>;
  let mockDataResponse: jest.Mocked<DataResponse<any>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTopicsService = new TopicsService(
      null as any,
      null as any,
      null as any,
    ) as jest.Mocked<TopicsService>;


    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockErrorResponse = {
      send: jest.fn(),
    } as any;

    mockDataResponse = {
      send: jest.fn(),
    } as any;

    (ErrorResponse.validation as jest.Mock) = jest.fn().mockReturnValue(mockErrorResponse);
    (ErrorResponse.internal as jest.Mock) = jest.fn().mockReturnValue(mockErrorResponse);
    (ErrorResponse.badRequest as jest.Mock) = jest.fn().mockReturnValue(mockErrorResponse);
    (ErrorResponse.notFound as jest.Mock) = jest.fn().mockReturnValue(mockErrorResponse);

    (DataResponse.created as jest.Mock) = jest.fn().mockReturnValue(mockDataResponse);
    (DataResponse.success as jest.Mock) = jest.fn().mockReturnValue(mockDataResponse);

    const mockTopicCreatePayloadSchema = TopicCreatePayloadSchema as jest.Mocked<typeof TopicCreatePayloadSchema>;
    const mockTopicUpdatePayloadSchema = TopicUpdatePayloadSchema as jest.Mocked<typeof TopicUpdatePayloadSchema>;

    mockTopicCreatePayloadSchema.parse = jest.fn().mockImplementation((data) => data);
    mockTopicUpdatePayloadSchema.parse = jest.fn().mockImplementation((data) => data);

    topicsController = new TopicsController(mockTopicsService);
  });

  describe('createTopic', () => {
    it('should create a topic successfully', async () => {
      mockRequest.body = topicPayload;
      mockTopicsService.createTopic.mockResolvedValue(mockTopicVersion);

      await topicsController.createTopic(mockRequest as Request, mockResponse as Response);

      expect(mockTopicsService.createTopic).toHaveBeenCalledWith(topicPayload);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'log');
      expect(loggerSpy).toHaveBeenCalledWith(`Topic created: ${mockTopicVersion.id} ${mockTopicVersion.name}`);
      expect(DataResponse.created).toHaveBeenCalledWith(mockTopicVersion, 'Topic created');
      expect(mockDataResponse.send).toHaveBeenCalledWith(mockResponse, 201);
    });

    it('should handle validation errors', async () => {
      const invalidPayload = { name: '', content: 'Test Content' };
      mockRequest.body = invalidPayload;

      const validationError = new z.ZodError([]);
      const mockTopicCreatePayloadSchema = TopicCreatePayloadSchema as jest.Mocked<typeof TopicCreatePayloadSchema>;
      mockTopicCreatePayloadSchema.parse = jest.fn().mockImplementation(() => {
        throw validationError;
      });

      await topicsController.createTopic(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.validation).toHaveBeenCalled();
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 400);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Validation error', validationError.message);
    });

    it('should handle service errors', async () => {
      mockRequest.body = topicPayload;
      const serviceError = new Error('Service error');
      mockTopicsService.createTopic.mockRejectedValue(serviceError);

      await topicsController.createTopic(mockRequest as Request, mockResponse as Response);

      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Failed to create topic', 'Service error');
      expect(ErrorResponse.internal).toHaveBeenCalledWith('Failed to create topic', 'Service error');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 500);
    });

    it('should handle unknown errors', async () => {
      mockRequest.body = topicPayload;
      mockTopicsService.createTopic.mockRejectedValue('Unknown error');

      await topicsController.createTopic(mockRequest as Request, mockResponse as Response);

      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Failed to create topic', 'Unknown error');
      expect(ErrorResponse.internal).toHaveBeenCalledWith('Failed to create topic', 'Unknown error');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 500);
    });
  });

  describe('getTopics', () => {
    it('should get all topics successfully', async () => {
      const topics = Object.values(mockHierarchicalTopics);
      mockTopicsService.getTopics.mockResolvedValue(topics);

      await topicsController.getTopics(mockRequest as Request, mockResponse as Response);

      expect(mockTopicsService.getTopics).toHaveBeenCalled();
      const loggerSpy = jest.spyOn(topicsController['logger'], 'log');
      expect(loggerSpy).toHaveBeenCalledWith(`Topics fetched: ${topics.length}`);
      expect(DataResponse.success).toHaveBeenCalledWith(topics, 'Topics fetched');
      expect(mockDataResponse.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Service error');
      mockTopicsService.getTopics.mockRejectedValue(serviceError);

      await topicsController.getTopics(mockRequest as Request, mockResponse as Response);

      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Failed to get topics', 'Service error');
      expect(ErrorResponse.internal).toHaveBeenCalledWith('Failed to get topics', 'Service error');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 500);
    });
  });

  describe('updateTopic', () => {
    it('should update a topic successfully', async () => {

      mockRequest.body = topicPayload;
      mockRequest.params = { id: '1' };
      mockTopicsService.updateTopic.mockResolvedValue(mockTopicVersion);

      await topicsController.updateTopic(mockRequest as Request, mockResponse as Response);

      expect(mockTopicsService.updateTopic).toHaveBeenCalledWith(1, topicPayload);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'log');
      expect(loggerSpy).toHaveBeenCalledWith(`Topic updated: ${mockTopicVersion.id} ${mockTopicVersion.name}`);
      expect(DataResponse.success).toHaveBeenCalledWith(mockTopicVersion, 'Topic updated successfully');
      expect(mockDataResponse.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle missing topic ID', async () => {
      mockRequest.body = { name: 'Test' };
      mockRequest.params = {};

      await topicsController.updateTopic(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.badRequest).toHaveBeenCalledWith('Invalid request', 'Topic ID is required');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 400);
    });

    it('should handle validation errors', async () => {
      mockRequest.body = { name: '' };
      mockRequest.params = { id: '1' };

      const validationError = new z.ZodError([]);
      const mockTopicUpdatePayloadSchema = TopicUpdatePayloadSchema as jest.Mocked<typeof TopicUpdatePayloadSchema>;
      mockTopicUpdatePayloadSchema.parse = jest.fn().mockImplementation(() => {
        throw validationError;
      });

      await topicsController.updateTopic(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.validation).toHaveBeenCalled();
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 400);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Validation error', validationError.message);
    });
  });

  describe('getTopic', () => {
    it('should get a topic successfully', async () => {
      mockRequest.params = { id: '1' };
      const mockTopic = mockHierarchicalTopics[1]!;
      mockTopicsService.getTopic.mockResolvedValue(mockTopic);

      await topicsController.getTopic(mockRequest as Request, mockResponse as Response);

      expect(mockTopicsService.getTopic).toHaveBeenCalledWith(1);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'log');
      expect(loggerSpy).toHaveBeenCalledWith(`Topic fetched: ${mockTopic?.id}`);
      expect(DataResponse.success).toHaveBeenCalledWith(mockTopic, 'Topic fetched successfully');
      expect(mockDataResponse.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle missing topic ID', async () => {
      mockRequest.params = {};

      await topicsController.getTopic(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.badRequest).toHaveBeenCalledWith('Invalid request', 'Topic ID is required');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 400);
    });

    it('should handle topic not found', async () => {
      mockRequest.params = { id: '999' };
      mockTopicsService.getTopic.mockResolvedValue(null);

      await topicsController.getTopic(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.notFound).toHaveBeenCalledWith('Topic not found');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 404);
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: '1' };
      const serviceError = new Error('Service error');
      mockTopicsService.getTopic.mockRejectedValue(serviceError);

      await topicsController.getTopic(mockRequest as Request, mockResponse as Response);

      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Failed to get topic', 'Service error');
      expect(ErrorResponse.internal).toHaveBeenCalledWith('Failed to get topic', 'Service error');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 500);
    });
  });

  describe('getTopicByVersion', () => {
    it('should get a topic by version successfully', async () => {
      mockRequest.params = { id: '1', version: '2' };
      const mockTopic = mockHierarchicalTopics[1]!;
      mockTopicsService.getTopicByVersion.mockResolvedValue(mockTopic);

      await topicsController.getTopicByVersion(mockRequest as Request, mockResponse as Response);

      expect(mockTopicsService.getTopicByVersion).toHaveBeenCalledWith(1, 2);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'log');
      expect(loggerSpy).toHaveBeenCalledWith(`Topic fetched: ${mockTopic?.id}`);
      expect(DataResponse.success).toHaveBeenCalledWith(mockTopic, 'Topic fetched successfully');
      expect(mockDataResponse.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle missing parameters', async () => {
      mockRequest.params = { id: '1' };

      await topicsController.getTopicByVersion(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.badRequest).toHaveBeenCalledWith('Invalid request', 'Topic ID and version are required');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 400);
    });

    it('should handle topic not found', async () => {
      mockRequest.params = { id: '999', version: '1' };
      mockTopicsService.getTopicByVersion.mockResolvedValue(null);

      await topicsController.getTopicByVersion(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.notFound).toHaveBeenCalledWith('Topic not found');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 404);
    });
  });

  describe('deleteTopic', () => {
    it('should delete a topic successfully', async () => {
      mockRequest.params = { id: '1' };
      mockTopicsService.deleteTopic.mockResolvedValue(true);

      await topicsController.deleteTopic(mockRequest as Request, mockResponse as Response);

      expect(mockTopicsService.deleteTopic).toHaveBeenCalledWith(1);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'log');
      expect(loggerSpy).toHaveBeenCalledWith('Topic deleted: 1');
      expect(DataResponse.success).toHaveBeenCalledWith(null, 'Topic deleted successfully');
      expect(mockDataResponse.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle missing topic ID', async () => {
      mockRequest.params = {};

      await topicsController.deleteTopic(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.badRequest).toHaveBeenCalledWith('Invalid request', 'Topic ID is required');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 400);
    });

    it('should handle topic not found', async () => {
      mockRequest.params = { id: '999' };
      mockTopicsService.deleteTopic.mockResolvedValue(false);

      await topicsController.deleteTopic(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.notFound).toHaveBeenCalledWith('Topic not found');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 404);
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: '1' };
      const serviceError = new Error('Service error');
      mockTopicsService.deleteTopic.mockRejectedValue(serviceError);

      await topicsController.deleteTopic(mockRequest as Request, mockResponse as Response);

      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Failed to delete topic', 'Service error');
      expect(ErrorResponse.internal).toHaveBeenCalledWith('Failed to delete topic', 'Service error');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 500);
    });
  });

  describe('getShortestPath', () => {
    it('should get shortest path successfully', async () => {
      mockRequest.params = { fromId: '1', toId: '3' };
      const shortestPath = [1, 2, 3];
      mockTopicsService.findShortestPath.mockResolvedValue(shortestPath);

      await topicsController.getShortestPath(mockRequest as Request, mockResponse as Response);

      expect(mockTopicsService.findShortestPath).toHaveBeenCalledWith(1, 3);
      const loggerSpy = jest.spyOn(topicsController['logger'], 'log');
      expect(loggerSpy).toHaveBeenCalledWith(`Shortest path fetched: ${shortestPath.length}`);
      expect(DataResponse.success).toHaveBeenCalledWith('Shortest path is 1 -> 2 -> 3', 'Shortest path fetched successfully');
      expect(mockDataResponse.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle missing parameters', async () => {
      mockRequest.params = { fromId: '1' };

      await topicsController.getShortestPath(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.badRequest).toHaveBeenCalledWith('Invalid request', 'From ID and to ID are required');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 400);
    });

    it('should handle path not found', async () => {
      mockRequest.params = { fromId: '1', toId: '999' };
      mockTopicsService.findShortestPath.mockResolvedValue(null);

      await topicsController.getShortestPath(mockRequest as Request, mockResponse as Response);

      expect(ErrorResponse.notFound).toHaveBeenCalledWith('Shortest path not found');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 404);
    });

    it('should handle service errors', async () => {
      mockRequest.params = { fromId: '1', toId: '3' };
      const serviceError = new Error('Service error');
      mockTopicsService.findShortestPath.mockRejectedValue(serviceError);

      await topicsController.getShortestPath(mockRequest as Request, mockResponse as Response);

      const loggerSpy = jest.spyOn(topicsController['logger'], 'error');
      expect(loggerSpy).toHaveBeenCalledWith('Failed to get shortest path', 'Service error');
      expect(ErrorResponse.internal).toHaveBeenCalledWith('Failed to get shortest path', 'Service error');
      expect(mockErrorResponse.send).toHaveBeenCalledWith(mockResponse, 500);
    });
  });

});
