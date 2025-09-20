import { TopicsRepository } from '@/features/topics/topics.repository';

import { ResourcesRepository } from '@/features/resources/resources.repository';
import { TopicVersionService } from '@/features/topics/topic-versions/topic-version.service';
import { TopicsService } from '@/features/topics/topics.service';
import { mockHierarchicalTopics, mockTopic, mockTopicVersion } from '@/tests/mockData';

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
});
