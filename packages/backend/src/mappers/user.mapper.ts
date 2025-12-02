import { token } from "morgan";
import { User, UserCapability, UserRole, UserStatus } from "../../../../types";
import { UserDto } from "../dto/user.dto";
import { v4 as uuidv4 } from "uuid";
export function fromUserToDto(user: User): UserDto {
  const {
    id,
    capabilities,
    google_id,
    // internalAccessToken,
    // internalRefreshToken,
    googleAccessToken,
    googleRefreshToken,
    ...dtoFields
  } = user;
  return dtoFields;
}
export function fromDtoToUser(dto: UserDto): User {
  return {
    ...dto,
    id: generateId(),
    capabilities: [],
    google_id: "",
    internal_access_token: null,
    internal_refresh_token: null,
    googleAccessToken: null,
    googleRefreshToken: null,
  };
}

function generateId(): string {
  return uuidv4();
}
export function fromSupabaseToUser(record: any): User {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    phone: record.phone ?? undefined,
    role: record.role as UserRole,
    status: record.status as UserStatus,
    profileImageUrl: record.profile_image_url ?? undefined,
    //createdAt: new Date(record.created_at),
    //updatedAt: new Date(record.updated_at),
    lastLogin: record.last_login ? new Date(record.last_login) : undefined,
    locationId: record.location_id ?? undefined,
    google_id: record.google_id ?? '',
    token: record.google_access_token ?? '',
    capabilities: record.capabilities ?? [],
    internal_access_token: record.internal_access_token ?? undefined,
    internal_refresh_token: record.internal_refresh_token ?? undefined,
    googleAccessToken: record.google_access_token ?? null,
    googleRefreshToken: record.google_refresh_token ?? null,
  };
}
export function fromUserToSupabase(user: User): any {
  const result: any = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone ?? null,
    role: user.role,
    status: user.status,
    profile_image_url: user.profileImageUrl ?? null,
    created_at: user.createdAt ? user.createdAt.toISOString() : null,
    updated_at: user.updatedAt ? user.updatedAt.toISOString() : null,
    last_login: user.lastLogin ? user.lastLogin.toISOString() : null,
    location_id: user.locationId ?? null,
    google_id: user.google_id ?? null,
    capabilities: user.capabilities ?? [],
   
    google_access_token: user.googleAccessToken ?? null,
    google_refresh_token: user.googleRefreshToken ?? null,
    token: user.token
  };

  if (user.internal_access_token !== undefined) {
    result.internal_access_token = user.internal_access_token;
  }

  if (user.internal_refresh_token !== undefined) {
    result.internal_refresh_token = user.internal_refresh_token;
  }

  return result;
}

  