// hasPermission.js
import { PERMISSIONS } from './permissions';

const permissions = {
    SUPER_ADMIN: [
        PERMISSIONS.CREATE_ADMIN,
        PERMISSIONS.EDIT_ADMIN,
        PERMISSIONS.CREATE_BUSINESS,
        PERMISSIONS.EDIT_BUSINESS,
        PERMISSIONS.DELETE_ADMIN,
        PERMISSIONS.VERIFY_ADS,
        PERMISSIONS.DELETE_ADS,
        PERMISSIONS.BLACKLIST_ADS,
        PERMISSIONS.VERIFY_KYC,
        PERMISSIONS.VERIFY_AD,        // ✅ NEW
        // PERMISSIONS.DELETE_BUSINESS
    ],
    ADMIN: [
        PERMISSIONS.EDIT_ADS,
        PERMISSIONS.DELETE_ADS,
        PERMISSIONS.VERIFY_ADS,
        // PERMISSIONS.VERIFY_KYC            // ✅ Optional: Give to admin too
    ],
    BUSINESS: [
        PERMISSIONS.CREATE_BUSINESS,

        PERMISSIONS.ADD_ADS,
        PERMISSIONS.EDIT_ADS,
        PERMISSIONS.DELETE_BUSINESS_ADS
    ]
};

/**
 * Checks if a given role has a specific permission.
 * @param {string} role - User's role (e.g., 'admin', 'business', 'super_admin')
 * @param {string} permission - Permission key from PERMISSIONS
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
    return permissions[role]?.includes(permission) || false;
}

export const rolePermissions = permissions;
