import { TopicsRepository } from "@/features/topics/topics.repository";
import { Topic } from "@/features/topics/topic.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "@/core/database/data-source";
import { mockTopic } from "@/tests/mockData";

jest.mock('@/core/logger');

jest.mock('@/core/database/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('TopicsRepository', () => {
  let topicsRepository: TopicsRepository;
  let mockRepository: jest.Mocked<Repository<Topic>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    } as any;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    topicsRepository = new TopicsRepository();
  });

  describe('findAllTopics', () => {
    it('should return all topics from the repository', async () => {
      const expectedTopics: Topic[] = [
        { ...mockTopic, id: 1 },
        { ...mockTopic, id: 2 },
      ];

      mockRepository.find.mockResolvedValue(expectedTopics);

      const result = await topicsRepository.findAllTopics();

      expect(result).toEqual(expectedTopics);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(mockRepository.find).toHaveBeenCalledWith();
    });

  });

  describe('createTopic', () => {
    it('should create and save a new topic', async () => {
      const newTopic = { ...mockTopic };
      const savedTopic = { ...mockTopic, id: 1 };

      mockRepository.create.mockReturnValue(newTopic);
      mockRepository.save.mockResolvedValue(savedTopic);

      const result = await topicsRepository.createTopic();

      expect(result).toEqual(savedTopic);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({});
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(newTopic);
    });


  });

  describe('findById', () => {
    it('should return topic when found by id', async () => {
      const topicId = 1;
      const expectedTopic = { ...mockTopic, id: topicId };

      mockRepository.findOne.mockResolvedValue(expectedTopic);

      const result = await topicsRepository.findById(topicId);

      expect(result).toEqual(expectedTopic);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: topicId } });
    });

    it('should return null when topic not found', async () => {
      const topicId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      const result = await topicsRepository.findById(topicId);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: topicId } });
    });

  });

  describe('delete', () => {
    it('should delete topic when found by id', async () => {
      const topicId = 1;
      const topicToDelete = { ...mockTopic, id: topicId };
      const loggerSpy = jest.spyOn(topicsRepository['logger'], 'warn');

      mockRepository.findOneBy.mockResolvedValue(topicToDelete);
      mockRepository.remove.mockResolvedValue(topicToDelete);

      const result = await topicsRepository.delete(topicId);

      expect(result).toEqual(topicToDelete);
      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: topicId });
      expect(mockRepository.remove).toHaveBeenCalledTimes(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(topicToDelete);
      expect(loggerSpy).not.toHaveBeenCalled();
    });

    it('should log warning and return undefined when topic not found', async () => {
      const topicId = 999;

      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await topicsRepository.delete(topicId);

      expect(result).toBeUndefined();
      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: topicId });
      expect(mockRepository.remove).not.toHaveBeenCalled();
      const loggerSpy = jest.spyOn(topicsRepository['logger'], 'warn');
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith(`Topic not found for id: ${topicId}`);
    });

  });
});
