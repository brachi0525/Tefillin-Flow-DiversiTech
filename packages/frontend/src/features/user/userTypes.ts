export enum UserCapability {
    // Core Administrative Functions
    MANAGE_USERS = "manage_users",              // Can manage users, locations, and their permissions
    
    // Soldier Management
    VIEW_ASSIGNED_SOLDIERS = "view_assigned_soldiers", // Can view soldiers assigned to their location
    VIEW_ALL_SOLDIERS = "view_all_soldiers",    // Can view all soldiers including private
    MANAGE_SOLDIERS = "manage_soldiers",        // Can approve, assign, edit soldier information
    
    // Inventory Management
    VIEW_INVENTORY = "view_inventory",          // Can view inventory at their location
    VIEW_ALL_INVENTORY = "view_all_inventory",  // Can view inventory across all locations
    MANAGE_INVENTORY = "manage_inventory",      // Can update inventory and tefillin tracking
    
    // Distribution Process
    RECORD_DISTRIBUTION = "record_distribution", // Can record distribution, upload media, confirm shipments
    
    // Reporting
    VIEW_LOCATION_REPORTS = "view_location_reports", // Can view reports for their location
    VIEW_ALL_REPORTS = "view_all_reports",      // Can view system-wide reports
    
    // Public Content
    MANAGE_PUBLIC_CONTENT = "manage_public_content", // Can edit public content and approve media
  }
  
  export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
  }
  
  export enum UserRole {
      SYSTEM_ADMIN = "system_admin",
      ADMINISTRATOR = "administrator",
      MANAGER = "manager",
      LOCATION_RABBI = "location_rabbi",
      INVENTORY_MANAGER = "inventory_manager",
      CUSTOM = "custom"
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    profileImageUrl?: string;
    role: UserRole;
    status: UserStatus;
    locationId?: string;  // Reference to associated location (for location rabbis)
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
  }

  export interface UserDTO {
    email: string;
    name?: string;
    phone?: string;
    role: UserRole;
    locationId?: string;
    status?: UserStatus;
    password?: string;
    sendInvite?: boolean;
  }
  
  export const DEFAULT_ROLE_CAPABILITIES: Record<UserRole, UserCapability[]> = {
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
      UserCapability.MANAGE_PUBLIC_CONTENT,
      UserCapability.VIEW_ALL_REPORTS,
    
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
  }