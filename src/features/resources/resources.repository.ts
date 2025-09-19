import { BaseRepository } from "@/lib/BaseRepository";
import { Resource } from "@/features/resources/resource.entity";

export class ResourcesRepository extends BaseRepository<Resource> {
  constructor() {
    super(Resource);
  }

  async createResource(resource: Partial<Resource>): Promise<Resource> {
    const newResource = this.repository.create(resource);
    return await this.repository.save(newResource);
  }

  async findAllResources(): Promise<Resource[]> {
    return await this.repository.find();
  }

  async findByTopicVersionId(topicVersionId: number): Promise<Resource[]> {
    return await this.repository.find({ where: { topicVersionId } });
  }

  async findById(id: number): Promise<Resource | null> {
    return await this.repository.findOneBy({ id });
  }

  async delete(id: number) {
    const resource = await this.repository.findOneBy({ id });

    if (!resource) {
      console.warn(`Resource not found for id: ${id}`);
      return;
    }

    return await this.repository.remove(resource);
  }

  async update(id: number, resourcePayload: Partial<Resource>): Promise<Resource | null> {
    await this.repository.update(id, resourcePayload);
    return await this.repository.findOneBy({ id });
  }
}
