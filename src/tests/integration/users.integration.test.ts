import request from 'supertest';
import { App } from '@/core/app';
import { AppDataSource } from '@/core/database/data-source';

jest.mock('@/core/database/data-source');

describe('Users Integration Tests', () => {
  let app: App;

  beforeAll(() => {
    (AppDataSource.initialize as jest.Mock).mockResolvedValue(undefined);
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      find: jest.fn().mockResolvedValue([]),
    });

    app = new App();
  });

  describe('GET /users', () => {
    it('should return users list', async () => {
      const response = await request(app.app)
        .get('/users')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should return JSON content type', async () => {
      const response = await request(app.app)
        .get('/users')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app.app)
        .get('/non-existent-route')
        .expect(404);
    });
  });
});
