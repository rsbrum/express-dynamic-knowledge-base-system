import { TopicVersion } from "@/features/topics/topic-version.entity";
import { TopicVersionsRepository } from "@/features/topics/topic-version.repository";

export class TopicVersionFactory {
  constructor(private topicVersionsRepository: TopicVersionsRepository) {}


	async createTopicVersion(topicVersion: Partial<TopicVersion>): Promise<TopicVersion> {
    const latest = await this.topicVersionsRepository.findLatestVersion(topicVersion.topicId!);
    const nextVersion = latest ? latest.version + 1 : 1;

    const newVersion = new TopicVersion();
    newVersion.name = topicVersion.name!;
    newVersion.content = topicVersion.content!;
    newVersion.version = nextVersion;
    newVersion.topicId = topicVersion.topicId!;
    newVersion.parentTopicId = topicVersion.parentTopicId!;

    return newVersion;
	}

	async latestVersion(topicId: number): Promise<TopicVersion | null> {
		return await this.topicVersionsRepository.findLatestVersion(topicId);
	}

	async specificVersion(topicId: number, version: number): Promise<TopicVersion | null> {
		return await this.topicVersionsRepository.findSpecificVersion(topicId, version);
	}
}
