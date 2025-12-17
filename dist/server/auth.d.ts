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
export declare function extractUserFromRequest(request: NextRequest): User | null;
/**
 * Extract user ID from request (convenience function)
 */
export declare function getUserId(request: NextRequest): string | null;
/**
 * Get feature pack config from JWT token claims
 */
export declare function getFeaturePackConfig(request: NextRequest): EquipmentMaintenanceTrackerConfig;
/**
 * Check if user has a specific role
 */
export declare function hasRole(user: User | null, role: string, config: EquipmentMaintenanceTrackerConfig): boolean;
/**
 * Check if user has admin access
 */
export declare function isAdmin(user: User | null, config: EquipmentMaintenanceTrackerConfig): boolean;
/**
 * Check if user can change pump status
 */
export declare function canChangeStatus(user: User | null, config: EquipmentMaintenanceTrackerConfig): boolean;
/**
 * Check if user can dispatch from inventory
 */
export declare function canManageInventory(user: User | null, config: EquipmentMaintenanceTrackerConfig): boolean;
/**
 * Check if user can complete rebuilds
 */
export declare function canCompleteRebuild(user: User | null, config: EquipmentMaintenanceTrackerConfig): boolean;
/**
 * Check if user can enter field data
 */
export declare function canEnterFieldData(user: User | null, config: EquipmentMaintenanceTrackerConfig): boolean;
/**
 * Check if user can view analytics
 */
export declare function canViewAnalytics(user: User | null, config: EquipmentMaintenanceTrackerConfig): boolean;
//# sourceMappingURL=auth.d.ts.map