import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';
import { Topic } from '@/features/topics/topic.entity';
import { IHierarchicalTopicVersion } from '@/lib/IHierarchicalTopicVersion';
import { EUserRole } from '@/lib/EUserRole';
import { User } from '@/features/users/user.entity';
import { Resource } from '@/features/resources/resource.entity';

export const mockTopic: Topic = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockTopicVersion: TopicVersion = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  topicId: 1,
  parentTopicId: null,
  name: 'Test Topic',
  content: 'Test Content',
  topic: mockTopic,
  resources: [],
};

export const mockHierarchicalTopics: Record<number, IHierarchicalTopicVersion> = {
  1: {
    id: 1,
    name: 'Root Topic',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    parentTopicId: null,
    topicId: 1,
    resources: [],
    children: [
      {
        id: 2,
        name: 'Child 1',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
        parentTopicId: 1,
        topicId: 2,
        resources: [],
      },
      {
        id: 3,
        name: 'Child 2',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
        parentTopicId: 1,
        topicId: 3,
        resources: [],
      },
    ],
  },
  2: {
    id: 2,
    name: 'Child 1',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
    parentTopicId: 1,
    topicId: 2,
    resources: [],
    children: [
      {
        id: 4,
        name: 'Grandchild 1',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
        parentTopicId: 2,
        topicId: 4,
        resources: [],
      },
    ],
  },
  3: {
    id: 3,
    name: 'Child 2',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
    parentTopicId: 1,
    topicId: 3,
    resources: [],
    children: [
      {
        id: 5,
        name: 'Grandchild 2',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
        parentTopicId: 3,
        topicId: 5,
        resources: [],
      },
    ],
  },
  4: {
    id: 4,
    name: 'Grandchild 1',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
    parentTopicId: 2,
    topicId: 4,
    resources: [],
    children: [],
  },
  5: {
    id: 5,
    name: 'Grandchild 2',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
    parentTopicId: 3,
    topicId: 5,
    resources: [],
    children: [],
  },
  6: {
    id: 6,
    name: 'Isolated Topic',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
    parentTopicId: null,
    topicId: 6,
    resources: [],
    children: [],
  },
};

export const topicPayload: Partial<TopicVersion> = {
  name: 'Test Topic',
  content: 'Test Content',
  parentTopicId: null,
};

export const topicUpdatePayload: Partial<TopicVersion> = {
  name: 'Updated Topic',
  content: 'Updated Content',
  parentTopicId: null,
  id: 1,
  version: 2,
  topicId: 1,
};

export const mockUser: User = {
  id: 1,
  name: 'Test User',
  role: EUserRole.ADMIN,
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockResource: Resource = {
  id: 1,
  url: 'http://test.com',
  description: 'Test Description',
  type: 'link',
  topicVersionId: 1,
  topicId: 1,
  topicVersion: mockTopicVersion,
  createdAt: new Date(),
  updatedAt: new Date(),
};
