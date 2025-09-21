import { Topic } from "@/features/topics/topic.entity";

describe('Topic', () => {
  it('should create a topic with all properties', () => {
    const topic = Object.assign(new Topic(), {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(topic.id).toBeDefined();
    expect(topic.createdAt).toBeDefined();
    expect(topic.updatedAt).toBeDefined();
  });
});
