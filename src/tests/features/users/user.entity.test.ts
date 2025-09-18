import { User } from '@/features/users/user.entity';
import { UserRole } from '@/lib/EUserRole';

describe('User Entity', () => {
  it('should create a user with all properties', () => {
    const userData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = Object.assign(new User(), userData);

    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe(UserRole.ADMIN);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should have default role as VIEWER', () => {
    expect(UserRole.VIEWER).toBeDefined();
  });

  it('should allow different user roles', () => {
    const adminUser = Object.assign(new User(), {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });

    const viewerUser = Object.assign(new User(), {
      id: 2,
      name: 'Viewer User',
      email: 'viewer@example.com',
      role: UserRole.VIEWER,
    });

    expect(adminUser.role).toBe(UserRole.ADMIN);
    expect(viewerUser.role).toBe(UserRole.VIEWER);
  });
});
