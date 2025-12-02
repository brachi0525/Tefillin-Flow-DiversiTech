"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ROLE_CAPABILITIES = exports.UserRole = exports.UserStatus = exports.UserCapability = void 0;
var UserCapability;
(function (UserCapability) {
    // Core Administrative Functions
    UserCapability["MANAGE_USERS"] = "manage_users";
    // Soldier Management
    UserCapability["VIEW_ASSIGNED_SOLDIERS"] = "view_assigned_soldiers";
    UserCapability["VIEW_ALL_SOLDIERS"] = "view_all_soldiers";
    UserCapability["MANAGE_SOLDIERS"] = "manage_soldiers";
    // Inventory Management
    UserCapability["VIEW_INVENTORY"] = "view_inventory";
    UserCapability["VIEW_ALL_INVENTORY"] = "view_all_inventory";
    UserCapability["MANAGE_INVENTORY"] = "manage_inventory";
    // Distribution Process
    UserCapability["RECORD_DISTRIBUTION"] = "record_distribution";
    // Reporting
    UserCapability["VIEW_LOCATION_REPORTS"] = "view_location_reports";
    UserCapability["VIEW_ALL_REPORTS"] = "view_all_reports";
    // Public Content
    UserCapability["MANAGE_PUBLIC_CONTENT"] = "manage_public_content";
})(UserCapability || (exports.UserCapability = UserCapability = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["SYSTEM_ADMIN"] = "system_admin";
    UserRole["ADMINISTRATOR"] = "administrator";
    UserRole["MANAGER"] = "manager";
    UserRole["LOCATION_RABBI"] = "location_rabbi";
    UserRole["INVENTORY_MANAGER"] = "inventory_manager";
    UserRole["CUSTOM"] = "custom";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.DEFAULT_ROLE_CAPABILITIES = {
    [UserRole.SYSTEM_ADMIN]: [
        UserCapability.MANAGE_USERS
    ],
    [UserRole.ADMINISTRATOR]: [
        UserCapability.MANAGE_USERS,
        UserCapability.VIEW_ALL_SOLDIERS,
        UserCapability.MANAGE_SOLDIERS,
        UserCapability.VIEW_ALL_INVENTORY,
        UserCapability.MANAGE_INVENTORY,
        UserCapability.RECORD_DISTRIBUTION,
        UserCapability.VIEW_ALL_REPORTS,
        UserCapability.MANAGE_PUBLIC_CONTENT
    ],
    [UserRole.MANAGER]: [
        UserCapability.VIEW_ALL_SOLDIERS,
        UserCapability.MANAGE_SOLDIERS,
        UserCapability.VIEW_ALL_INVENTORY,
        UserCapability.MANAGE_INVENTORY,
        UserCapability.RECORD_DISTRIBUTION,
        UserCapability.VIEW_ALL_REPORTS,
        UserCapability.MANAGE_PUBLIC_CONTENT
    ],
    [UserRole.LOCATION_RABBI]: [
        UserCapability.VIEW_ASSIGNED_SOLDIERS,
        UserCapability.VIEW_INVENTORY,
        UserCapability.RECORD_DISTRIBUTION,
        UserCapability.VIEW_LOCATION_REPORTS
    ],
    [UserRole.INVENTORY_MANAGER]: [
        UserCapability.VIEW_ALL_INVENTORY,
        UserCapability.MANAGE_INVENTORY,
        UserCapability.VIEW_ALL_REPORTS
    ],
    [UserRole.CUSTOM]: []
};
