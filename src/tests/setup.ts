import 'reflect-metadata';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('@/core/database/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    isInitialized: false,
  },
}));
