// Define the linear status workflow transitions
const STATUS_TRANSITIONS = {
    "In Inventory": "Awaiting Install",
    "Awaiting Install": "In Service",
    "In Service": "Awaiting Wet End Removal",
    "Awaiting Wet End Removal": "Awaiting Rebuild",
    "Awaiting Rebuild": "Awaiting Wet End Install",
    "Awaiting Wet End Install": "In Inventory"
};
// Extended roles (when support_additional_roles is true)
const ROLES_ALLOWED_STATUS_CHANGES = ["Admin", "Supervisor", "Mechanic"];
const ROLES_ALLOWED_INVENTORY_DISPATCH = ["Admin", "Supervisor", "Inventory Manager"];
const ROLES_ALLOWED_REBUILD = ["Admin", "Pump Technician"];
const ROLES_ALLOWED_FIELD_DATA = ["Admin", "Supervisor", "Mechanic", "Vibration Technician"];
// Basic roles (when support_additional_roles is false)
const BASIC_ROLES_ALLOWED_STATUS_CHANGES = ["admin", "user"];
const BASIC_ROLES_ALLOWED_INVENTORY_DISPATCH = ["admin"];
const BASIC_ROLES_ALLOWED_REBUILD = ["admin"];
const BASIC_ROLES_ALLOWED_FIELD_DATA = ["admin", "user"];
/**
 * Validate status transition follows the linear workflow
 */
export function validateStatusTransition(currentStatus, newStatus) {
    const allowedNext = STATUS_TRANSITIONS[currentStatus];
    if (newStatus !== allowedNext) {
        return {
            valid: false,
            error: `Invalid status transition from "${currentStatus}" to "${newStatus}". Expected "${allowedNext}".`
        };
    }
    return { valid: true };
}
/**
 * Validate role permissions for status change
 */
export function validateRoleForStatusChange(role, currentStatus, newStatus, config) {
    const hasExtendedRoles = config.support_additional_roles === true;
    // Special case: Inventory dispatch
    if (currentStatus === "In Inventory" && newStatus === "Awaiting Install") {
        if (hasExtendedRoles) {
            if (!ROLES_ALLOWED_INVENTORY_DISPATCH.includes(role)) {
                return {
                    valid: false,
                    error: `Role "${role}" is not authorized to dispatch from inventory. Requires Admin, Supervisor, or Inventory Manager.`
                };
            }
        }
        else {
            if (!BASIC_ROLES_ALLOWED_INVENTORY_DISPATCH.includes(role)) {
                return {
                    valid: false,
                    error: `Role "${role}" is not authorized to dispatch from inventory. Requires admin.`
                };
            }
        }
        return { valid: true };
    }
    // Special case: Rebuild completion
    if (currentStatus === "Awaiting Rebuild" && newStatus === "Awaiting Wet End Install") {
        if (hasExtendedRoles) {
            if (!ROLES_ALLOWED_REBUILD.includes(role)) {
                return {
                    valid: false,
                    error: `Role "${role}" is not authorized to complete rebuilds. Requires Admin or Pump Technician.`
                };
            }
        }
        else {
            if (!BASIC_ROLES_ALLOWED_REBUILD.includes(role)) {
                return {
                    valid: false,
                    error: `Role "${role}" is not authorized to complete rebuilds. Requires admin.`
                };
            }
        }
        return { valid: true };
    }
    // All other transitions
    if (hasExtendedRoles) {
        if (!ROLES_ALLOWED_STATUS_CHANGES.includes(role)) {
            return {
                valid: false,
                error: `Role "${role}" is not authorized to change pump status. Requires Admin, Supervisor, or Mechanic.`
            };
        }
    }
    else {
        if (!BASIC_ROLES_ALLOWED_STATUS_CHANGES.includes(role)) {
            return {
                valid: false,
                error: `Role "${role}" is not authorized to change pump status. Requires admin or user.`
            };
        }
    }
    return { valid: true };
}
/**
 * Validate role permissions for field data entry
 */
export function validateRoleForFieldData(role, config) {
    const hasExtendedRoles = config.support_additional_roles === true;
    if (hasExtendedRoles) {
        if (!ROLES_ALLOWED_FIELD_DATA.includes(role)) {
            return {
                valid: false,
                error: `Role "${role}" is not authorized to enter field data. Requires Admin, Supervisor, Mechanic, or Vibration Technician.`
            };
        }
    }
    else {
        if (!BASIC_ROLES_ALLOWED_FIELD_DATA.includes(role)) {
            return {
                valid: false,
                error: `Role "${role}" is not authorized to enter field data. Requires admin or user.`
            };
        }
    }
    return { valid: true };
}
/**
 * Check if user can enter field data without changing status
 * (Only Vibration Technicians can do this when pump is "In Service")
 */
export function canEnterFieldDataWithoutStatusChange(role, currentStatus, config) {
    const hasExtendedRoles = config.support_additional_roles === true;
    if (hasExtendedRoles) {
        return role === "Vibration Technician" && currentStatus === "In Service";
    }
    // In basic mode, users can always enter field data
    return true;
}
