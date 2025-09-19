import { ResourcesRepository } from '@/features/resources/resources.repository';
import Logger from '@/core/logger';
import { Resource } from '@/features/resources/resource.entity';
import { TopicVersionsRepository } from '@/features/topics/topic-version.repository';

export class ResourcesService {
  private logger = new Logger(ResourcesService.name);

  constructor(
    private resourcesRepository: ResourcesRepository,
    private topicVersionsRepository: TopicVersionsRepository,
  ) {}

  async createResource(resource: Partial<Resource>): Promise<Resource> {
    const topicId = resource.topicId;

    if (!topicId) {
      throw new Error('Topic ID is not found');
    }

    const topicVersion = await this.topicVersionsRepository.findLatestVersion(topicId);

    if (!topicVersion) {
      throw new Error('Topic version not found');
    }

    const newResource = await this.resourcesRepository.createResource({
      ...resource,
      topicVersionId: topicVersion.id,
    });

    return newResource;
  }

  async deleteResource(id: number) {
    return await this.resourcesRepository.delete(id);
  }

  async updateResource(id: number, resourcePayload: Partial<Resource>) {
    const resource = await this.resourcesRepository.findById(id);

    if (!resource) {
      return null;
    }

    const updatedResource = await this.resourcesRepository.update(id, resourcePayload);
    return updatedResource;
  }

  async getResources() {
    return await this.resourcesRepository.findAllResources();
  }
}
