import { BaseRepository } from "../repositories/baseRepository";
import {
  CreateLocationDto,
  UpdateLocationDto,
  LocationResponseDto,
  AddressDto,
  AddressCreateDto,
} from "../dto/location .dto";
import { TefillinDto } from "../dto/teffilin.dto";
import { Location, Tefillin, User } from "../../../../types";
import { UserService } from "./UserService";
import { UserDto } from "../dto/user.dto";
import { tefillinService } from "./tefillinService";

export class LocationService {
  private locationRepo = new BaseRepository<LocationResponseDto>("locations");
  private addressRepo = new BaseRepository<AddressDto>("addresses");
  private userRepo = new BaseRepository<UserDto>("users");
  private tefillinRepo = new BaseRepository<TefillinDto>("tefillin");
  private userService = new UserService();
  private tefillinService = new tefillinService();

  private async countTefillinByLocation(locationId: string): Promise<{
    countAll: number;
    countReady: number;
  }> {
    const tefillins = await this.tefillinRepo.getAll();
    const filtered = (tefillins ?? []).filter((t) => t.locationId === locationId);
    const countAll = filtered.length;
    const countReady = filtered.filter((t) => t.status === "at_location").length;
    return { countAll, countReady };
  }

  async createLocation(dto: CreateLocationDto): Promise<LocationResponseDto> {
    console.log("address*******", dto.address as AddressCreateDto);

    const address = await this.addressRepo.insert(dto.address as AddressCreateDto);
    console.log("address***********", address);

    const locationData: any = { ...dto, addressId: address!.id };
    delete locationData.address;
    console.log("location data******", locationData);

    const location = await this.locationRepo.insert(locationData);
    const { countAll, countReady } = await this.countTefillinByLocation(location!.id);

    return {
      ...(location as LocationResponseDto),
      address: address!,
      countAll,
      countReady,
    };
  }

  async updateLocation(id: string, dto: UpdateLocationDto): Promise<LocationResponseDto | null> {
    const location = await this.locationRepo.getById(id);
    if (!location) return null;

    let address: AddressDto | null = null;
    if (location.addressId) {
      address = await this.addressRepo.getById(location.addressId.toString());
    }

    if (dto.address && address) {
      const updatedFields: Partial<AddressDto> = {};
      if (dto.address.country !== undefined) updatedFields.country = dto.address.country;
      if (dto.address.city !== undefined) updatedFields.city = dto.address.city;
      if (dto.address.street !== undefined) updatedFields.street = dto.address.street;
      if (dto.address.houseNumber !== undefined) updatedFields.houseNumber = dto.address.houseNumber;

      if (Object.keys(updatedFields).length > 0) {
        address = await this.addressRepo.update(address.id.toString(), updatedFields);
      }
    }

    const locationData: any = { ...dto };
    delete locationData.address;
    const updatedLocation = await this.locationRepo.update(id, locationData);

    const { countAll, countReady } = await this.countTefillinByLocation(id);

    return updatedLocation ? { ...updatedLocation, countAll, countReady, address: address! } : null;
  }

  async getAllLocations(): Promise<LocationResponseDto[]> {
    const locations = await this.locationRepo.getAll();

    const result = await Promise.all(
      (locations ?? []).map(async (loc: any) => {
        let address: AddressDto | null = null;
        if (loc.addressId) {
          address = await this.addressRepo.getById(loc.addressId.toString());
        }

        if (!address) {
          throw new Error("Address not found for location " + loc.id);
        }

        let rabbiName = "";
        if (loc.rabbiId) {
          const rabbi = await this.userService.getUserById(loc.rabbiId);
          if (!rabbi) {
            throw new Error("Rabbi not found for location " + loc.id);
          }
          rabbiName = rabbi.name ?? "";
        }

        const { countAll, countReady } = await this.countTefillinByLocation(loc.id);

        const dto: LocationResponseDto = {
          id: loc.id,
          name: loc.name,
          phone: loc.phone,
          createdAt: loc.created_at,
          addressId: loc.addressId,
          address,
          rabbiName,
          countAll,
          countReady,
        };

        return dto;
      })
    );

    return result;
  }

  async getLocationById(id: string): Promise<LocationResponseDto | null> {
    const location = await this.locationRepo.getById(id);
    if (!location) return null;

    let address: AddressDto | null = null;
    if (location.addressId) {
      address = await this.addressRepo.getById(location.addressId.toString());
    }

    const { countAll, countReady } = await this.countTefillinByLocation(id);

    return {
      ...location,
      countAll,
      countReady,
      address: address!,
    };
  }

  async updateRabbiForLocation(id: string, userEmail: string, skipLocationUpdate = false): Promise<LocationResponseDto | null> {
    const location = await this.locationRepo.getById(id);
    if (!location) throw new Error("Location not found");

    const oldRabbi = location.rabbiId;
    const userId = await this.userService.getIdByEmail(userEmail);
    if (!userId) throw new Error("User not found");

    const user = await this.userRepo.getById(userId);
    if (!user) throw new Error("User not found");

    location.rabbiId = userId;
    user.locationId = id;

    const updatedLocation = await this.locationRepo.update(id, { rabbiId: userId });
    if (!skipLocationUpdate) {
      const updatedUser = await this.userService.updateUser(userId, user, true);
    }

    return updatedLocation ? { ...updatedLocation, rabbiName: user.name } : null;
  }

  async removeRabbiFromLocation(locationId: string): Promise<LocationResponseDto | null> {
    const location = await this.locationRepo.getById(locationId);
    if (!location) throw new Error("Location not found");
    const updatedLocation = await this.locationRepo.update(locationId, { rabbiId: null });
    return updatedLocation ? { ...updatedLocation, rabbiName: "" } : null;
  }

  async deleteLocation(id: string): Promise<void> {
    await this.locationRepo.delete(id);
  }
}
