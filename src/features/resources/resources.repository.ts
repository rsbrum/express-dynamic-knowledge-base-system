import { BaseRepository } from "@/lib/BaseRepository";
import { Resource } from "@/features/resources/resource.entity";

export class ResourcesRepository extends BaseRepository<Resource> {
  constructor() {
    super(Resource);
  }

	async findAllResources(): Promise<Resource[]> {
		return await this.repository.find();
	}

}
