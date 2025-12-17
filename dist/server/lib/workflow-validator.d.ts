import { type PumpStatus } from '../../schema/equipment';
import type { EquipmentMaintenanceTrackerConfig } from '../auth';
export type UserRole = string;
/**
 * Validate status transition follows the linear workflow
 */
export declare function validateStatusTransition(currentStatus: PumpStatus, newStatus: PumpStatus): {
    valid: boolean;
    error?: string;
};
/**
 * Validate role permissions for status change
 */
export declare function validateRoleForStatusChange(role: UserRole, currentStatus: PumpStatus, newStatus: PumpStatus, config: EquipmentMaintenanceTrackerConfig): {
    valid: boolean;
    error?: string;
};
/**
 * Validate role permissions for field data entry
 */
export declare function validateRoleForFieldData(role: UserRole, config: EquipmentMaintenanceTrackerConfig): {
    valid: boolean;
    error?: string;
};
/**
 * Check if user can enter field data without changing status
 * (Only Vibration Technicians can do this when pump is "In Service")
 */
export declare function canEnterFieldDataWithoutStatusChange(role: UserRole, currentStatus: PumpStatus, config: EquipmentMaintenanceTrackerConfig): boolean;
//# sourceMappingURL=workflow-validator.d.ts.map