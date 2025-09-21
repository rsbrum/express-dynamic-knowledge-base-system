import { TopicsRepository } from '@/features/topics/topics.repository';

import { ResourcesRepository } from '@/features/resources/resources.repository';
import { TopicVersionService } from '@/features/topics/topic-versions/topic-version.service';
import { TopicsService } from '@/features/topics/topics.service';
import {
  mockHierarchicalTopics,
  mockResource,
  mockTopic,
  mockTopicVersion,
} from '@/tests/mockData';

jest.mock('@/features/topics/topics.repository');
jest.mock('@/features/topics/topic-versions/topic-version.service');
jest.mock('@/features/resources/resources.repository');

describe('TopicsService', () => {
  let topicsService: TopicsService;
  let mockTopicVersionService: jest.Mocked<TopicVersionService>;
  let mockTopicsRepository: jest.Mocked<TopicsRepository>;
  let mockResourcesRepository: jest.Mocked<ResourcesRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTopicsRepository = new TopicsRepository() as jest.Mocked<TopicsRepository>;
    mockTopicVersionService = new TopicVersionService(
      null as any,
    ) as jest.Mocked<TopicVersionService>;
    mockResourcesRepository = new ResourcesRepository() as jest.Mocked<ResourcesRepository>;

    topicsService = new TopicsService(
      mockTopicsRepository,
      mockTopicVersionService,
      mockResourcesRepository,
    );
  });

  describe('findShortestPath', () => {
    it('should return shortest path', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockImplementation(async (id: number) => {
        return mockHierarchicalTopics[id] || null;
      });

      const shortestPath = await topicsService.findShortestPath(1, 2);
      expect(shortestPath).toStrictEqual([1, 2]);
    });

    it('should return only one element', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockImplementation(async (id: number) => {
        return mockHierarchicalTopics[id] || null;
      });

      const shortestPath = await topicsService.findShortestPath(1, 1);
      expect(shortestPath).toStrictEqual([1]);
    });

    it('should return null - no path', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockImplementation(async (id: number) => {
        return mockHierarchicalTopics[id] || null;
      });

      const shortestPath = await topicsService.findShortestPath(1, 6);
      expect(shortestPath).toBeNull();
    });

    it('should return null - topic does not exist', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockImplementation(async (id: number) => {
        return mockHierarchicalTopics[id] || null;
      });

      const shortestPath = await topicsService.findShortestPath(1, 999);
      expect(shortestPath).toBeNull();
    });
  });

  describe('createTopic', () => {
    it('should create a topic', async () => {
      mockTopicsRepository.createTopic.mockResolvedValue(mockTopic);

      mockTopicVersionService.createTopicVersion.mockResolvedValue(mockTopicVersion);

      const topic = await topicsService.createTopic({
        name: 'Test Topic',
        content: 'Test Content',
      });

      expect(topic).toStrictEqual(mockTopicVersion);
    });
  });

  describe('getTopics', () => {
    it('should return all topics', async () => {
      mockTopicsRepository.findAllTopics.mockResolvedValue([mockTopic]);

      mockTopicVersionService.getLatestTopicVersion.mockImplementation(async (id: number) => {
        return mockHierarchicalTopics[id] || null;
      });

      const topics = await topicsService.getTopics();
      expect(topics).toStrictEqual([mockHierarchicalTopics[1]]);
    });
  });

  describe('getTopic', () => {
    it('should return a topic', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockImplementation(async (id: number) => {
        return mockHierarchicalTopics[id] || null;
      });

      const topic = await topicsService.getTopic(1);
      expect(topic).toStrictEqual(mockHierarchicalTopics[1]);
    });

    it('should return null - topic does not exist', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockImplementation(async (id: number) => {
        return mockHierarchicalTopics[id] || null;
      });

      const topic = await topicsService.getTopic(999);
      expect(topic).toBeNull();
    });
  });

  describe('getTopicByVersion', () => {
    it('should return a topic by version', async () => {
      mockTopicVersionService.getTopicByVersion.mockImplementation(
        async (id: number, version: number) => {
          return mockHierarchicalTopics[id] || null;
        },
      );

      const topic = await topicsService.getTopicByVersion(1, 1);
      expect(topic).toStrictEqual(mockHierarchicalTopics[1]);
    });
  });

  describe('updateTopic', () => {
    it('should update a topic', async () => {
      mockTopicVersionService.updateTopicVersion.mockResolvedValue(mockTopicVersion);

      const topic = await topicsService.updateTopic(1, {
        name: 'Test Topic',
        content: 'Test Content',
      });

      expect(topic).toStrictEqual(mockTopicVersion);
    });
  });

  describe('deleteTopic', () => {
    it('should delete a single topic with no children', async () => {
      const mockSingleTopic = mockHierarchicalTopics[4]!;

      mockTopicVersionService.getLatestTopicVersion.mockResolvedValue(mockSingleTopic);
      mockTopicVersionService.getTopicVersionsByTopicId.mockResolvedValue([mockTopicVersion]);
      mockResourcesRepository.findByTopicVersionId.mockResolvedValue([]);
      mockTopicVersionService.deleteTopicVersion.mockResolvedValue(undefined);
      mockTopicsRepository.delete.mockResolvedValue(undefined);

      const result = await topicsService.deleteTopic(4);

      expect(result).toBe(true);
      expect(mockTopicVersionService.getTopicVersionsByTopicId).toHaveBeenCalledWith(4);
      expect(mockTopicVersionService.deleteTopicVersion).toHaveBeenCalledWith(mockTopicVersion.id);
      expect(mockTopicsRepository.delete).toHaveBeenCalledWith(4);
    });

    it('should delete a topic with children', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockResolvedValue(mockHierarchicalTopics[1]!);
      mockTopicVersionService.getTopicVersionsByTopicId.mockResolvedValue([mockTopicVersion]);
      mockResourcesRepository.findByTopicVersionId.mockResolvedValue([]);
      mockTopicVersionService.deleteTopicVersion.mockResolvedValue(undefined);
      mockTopicsRepository.delete.mockResolvedValue(undefined);

      const result = await topicsService.deleteTopic(1);

      expect(result).toBe(true);
      expect(mockTopicVersionService.getTopicVersionsByTopicId).toHaveBeenCalledWith(1);
      expect(mockTopicVersionService.getTopicVersionsByTopicId).toHaveBeenCalledWith(2);
      expect(mockTopicVersionService.getTopicVersionsByTopicId).toHaveBeenCalledWith(3);
      expect(mockTopicsRepository.delete).toHaveBeenCalledWith(1);
      expect(mockTopicsRepository.delete).toHaveBeenCalledWith(2);
      expect(mockTopicsRepository.delete).toHaveBeenCalledWith(3);
    });

    it('should delete resources of topic versions', async () => {
      mockTopicVersionService.getLatestTopicVersion.mockResolvedValue(mockHierarchicalTopics[4]!);
      mockTopicVersionService.getTopicVersionsByTopicId.mockResolvedValue([mockTopicVersion]);
      mockResourcesRepository.findByTopicVersionId.mockResolvedValue([mockResource]);
      mockResourcesRepository.delete.mockResolvedValue(undefined);
      mockTopicVersionService.deleteTopicVersion.mockResolvedValue(undefined);
      mockTopicsRepository.delete.mockResolvedValue(undefined);

      const result = await topicsService.deleteTopic(4);

      expect(result).toBe(true);
      expect(mockResourcesRepository.findByTopicVersionId).toHaveBeenCalledWith(
        mockTopicVersion.id,
      );
      expect(mockResourcesRepository.delete).toHaveBeenCalledWith(mockResource.id);
    });

    it('should handle multiple topic versions for the same topic', async () => {
      const mockTopicVersion2 = {
        ...mockTopicVersion,
        id: 2,
        version: 2,
      };

      mockTopicVersionService.getLatestTopicVersion.mockResolvedValue(mockHierarchicalTopics[4]!);
      mockTopicVersionService.getTopicVersionsByTopicId.mockResolvedValue([
        mockTopicVersion,
        mockTopicVersion2,
      ]);
      mockResourcesRepository.findByTopicVersionId.mockResolvedValue([]);
      mockTopicVersionService.deleteTopicVersion.mockResolvedValue(undefined);
      mockTopicsRepository.delete.mockResolvedValue(undefined);

      const result = await topicsService.deleteTopic(4);

      expect(result).toBe(true);
      expect(mockTopicVersionService.deleteTopicVersion).toHaveBeenCalledWith(mockTopicVersion.id);
      expect(mockTopicVersionService.deleteTopicVersion).toHaveBeenCalledWith(mockTopicVersion2.id);
    });

    it('should return false when topic does not exist', async () => {
      const loggerSpy = jest.spyOn(topicsService['logger'], 'warn');
      mockTopicVersionService.getLatestTopicVersion.mockResolvedValue(null);

      const result = await topicsService.deleteTopic(999);

      expect(result).toBe(false);
      expect(mockTopicVersionService.getTopicVersionsByTopicId).not.toHaveBeenCalled();
      expect(mockTopicsRepository.delete).not.toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Topic version for topic 999 not found');
    });
  });
});
