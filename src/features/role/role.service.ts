import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CacheManagerStore } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DatabaseService } from '@/core/database/database.service';
import { Role, RoleAccess, UserRoles } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManagerStore,
  ) {}
  // Role operations
  async createRole(name: string, description: string): Promise<Role> {
    return this.db.role.create({
      data: { name, description },
    });
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.db.role.findUnique({ where: { id } });
  }

  async updateRole(id: string, name?: string, description?: string): Promise<Role> {
    return this.db.role.update({
      where: { id },
      data: { name, description },
    });
  }

  async deleteRole(id: string): Promise<Role> {
    return this.db.role.delete({ where: { id } });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.db.role.findMany();
  }

  // UserRoles operations
  async assignRoleToUser(userId: string, roleId: string): Promise<UserRoles> {
    return this.db.userRoles.create({
      data: { userId, roleId },
    });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<UserRoles> {
    return this.db.userRoles.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  // RoleAccess operations
  async addRoleAccess(roleId: string, resource: string, action: string): Promise<RoleAccess> {
    return this.db.roleAccess.create({
      data: { roleId, resource, action },
    });
  }

  async removeRoleAccess(id: string): Promise<RoleAccess> {
    return this.db.roleAccess.delete({ where: { id } });
  }

  async getRoleAccess(roleId: string): Promise<RoleAccess[]> {
    return this.db.roleAccess.findMany({
      where: { roleId },
    });
  }

  async updateRoleAccess(id: string, resource?: string, action?: string): Promise<RoleAccess> {
    return this.db.roleAccess.update({
      where: { id },
      data: { resource, action },
    });
  }

  // Helper method to check if a user has a specific role
  async userHasRole(userId: string, roleName: string): Promise<boolean> {
    const userRole = await this.db.userRoles.findFirst({
      where: {
        userId,
        role: {
          name: roleName,
        },
      },
    });
    return !!userRole;
  }

  // Helper method to get all permissions for a user
  async getUserPermissions(userId: string): Promise<RoleAccess[]> {
    const userRoles = await this.db.userRoles.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            roleAccess: true,
          },
        },
      },
    });

    return userRoles.flatMap(ur => ur.role.roleAccess);
  }

  async getUserRoles(userId: string) {
    // Check if roles are cached
    const cachedRoles = await this.cacheManager.get(`roles-${userId}`);
    if (cachedRoles) {
      return cachedRoles;
    }

    // If not cached, query the roles from the database
    const userRoles = await this.db.userRoles.findMany({
      where: { userId },
      include: { role: true },
    });

    const roles = userRoles.map((userRole) => ({
      roleId: userRole.roleId,
      roleName: userRole.role.name,
      roleDescription: userRole.role.description,
    }));

    // Cache the roles with a TTL (time to live)
    await this.cacheManager.set(`user-roles-${userId}`, roles,  3600 ); // Cache for 10 minutes

    return roles;
  }
}
