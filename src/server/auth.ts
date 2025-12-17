// src/server/auth.ts
import { NextRequest } from 'next/server';

export interface User {
  sub: string;
  email: string;
  roles?: string[];
}

/**
 * Feature pack configuration
 */
export interface EquipmentMaintenanceTrackerConfig {
  support_additional_roles?: boolean;
}

/**
 * Extract user from JWT token in cookies or Authorization header
 * Also checks x-user-id header (set by proxy/middleware in production)
 */
export function extractUserFromRequest(request: NextRequest): User | null {
  // Check for token in cookie first
  let token = request.cookies.get('hit_token')?.value;

  // Fall back to Authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  // Check x-user-id header (set by proxy in production)
  const xUserId = request.headers.get('x-user-id');
  if (xUserId) {
    return { sub: xUserId, email: '' };
  }

  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      sub: payload.sub || payload.email || '',
      email: payload.email || '',
      roles: payload.roles || [],
    };
  } catch {
    return null;
  }
}

/**
 * Extract user ID from request (convenience function)
 */
export function getUserId(request: NextRequest): string | null {
  const user = extractUserFromRequest(request);
  return user?.sub || null;
}

/**
 * Get feature pack config from JWT token claims
 */
export function getFeaturePackConfig(request: NextRequest): EquipmentMaintenanceTrackerConfig {
  let token = request.cookies.get('hit_token')?.value;
  
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return { support_additional_roles: false };
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { support_additional_roles: false };
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Get feature pack config from token claims
    const featurePacks = payload.featurePacks || {};
    const packConfig = featurePacks['equipment-maintenance-tracker'] || {};
    const options = packConfig.options || {};
    
    return {
      support_additional_roles: options.support_additional_roles === true,
    };
  } catch {
    return { support_additional_roles: false };
  }
}

/**
 * Check if user has a specific role
 */
export function hasRole(
  user: User | null,
  role: string,
  config: EquipmentMaintenanceTrackerConfig
): boolean {
  if (!user) return false;

  const hasExtendedRoles = config.support_additional_roles === true;

  if (hasExtendedRoles) {
    // Extended roles: Admin, Supervisor, Mechanic, etc.
    return user.roles?.includes(role) || false;
  } else {
    // Basic roles: admin, user
    return user.roles?.includes(role) || false;
  }
}

/**
 * Check if user has admin access
 */
export function isAdmin(
  user: User | null,
  config: EquipmentMaintenanceTrackerConfig
): boolean {
  if (!user) return false;

  const hasExtendedRoles = config.support_additional_roles === true;

  if (hasExtendedRoles) {
    return hasRole(user, 'Admin', config) || hasRole(user, 'admin', config);
  } else {
    return hasRole(user, 'admin', config);
  }
}

/**
 * Check if user can change pump status
 */
export function canChangeStatus(
  user: User | null,
  config: EquipmentMaintenanceTrackerConfig
): boolean {
  if (!user) return false;

  const hasExtendedRoles = config.support_additional_roles === true;

  if (hasExtendedRoles) {
    return hasRole(user, 'Admin', config) ||
           hasRole(user, 'Supervisor', config) ||
           hasRole(user, 'Mechanic', config);
  } else {
    return hasRole(user, 'admin', config) || hasRole(user, 'user', config);
  }
}

/**
 * Check if user can dispatch from inventory
 */
export function canManageInventory(
  user: User | null,
  config: EquipmentMaintenanceTrackerConfig
): boolean {
  if (!user) return false;

  const hasExtendedRoles = config.support_additional_roles === true;

  if (hasExtendedRoles) {
    return hasRole(user, 'Admin', config) ||
           hasRole(user, 'Supervisor', config) ||
           hasRole(user, 'Inventory Manager', config);
  } else {
    return hasRole(user, 'admin', config);
  }
}

/**
 * Check if user can complete rebuilds
 */
export function canCompleteRebuild(
  user: User | null,
  config: EquipmentMaintenanceTrackerConfig
): boolean {
  if (!user) return false;

  const hasExtendedRoles = config.support_additional_roles === true;

  if (hasExtendedRoles) {
    return hasRole(user, 'Admin', config) ||
           hasRole(user, 'Pump Technician', config);
  } else {
    return hasRole(user, 'admin', config);
  }
}

/**
 * Check if user can enter field data
 */
export function canEnterFieldData(
  user: User | null,
  config: EquipmentMaintenanceTrackerConfig
): boolean {
  if (!user) return false;

  const hasExtendedRoles = config.support_additional_roles === true;

  if (hasExtendedRoles) {
    return hasRole(user, 'Admin', config) ||
           hasRole(user, 'Supervisor', config) ||
           hasRole(user, 'Mechanic', config) ||
           hasRole(user, 'Vibration Technician', config);
  } else {
    return hasRole(user, 'admin', config) || hasRole(user, 'user', config);
  }
}

/**
 * Check if user can view analytics
 */
export function canViewAnalytics(
  user: User | null,
  config: EquipmentMaintenanceTrackerConfig
): boolean {
  if (!user) return false;

  const hasExtendedRoles = config.support_additional_roles === true;

  if (hasExtendedRoles) {
    return hasRole(user, 'Admin', config) ||
           hasRole(user, 'Supervisor', config);
  } else {
    return hasRole(user, 'admin', config);
  }
}

