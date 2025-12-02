import { error } from "console";
import { User, UserRole } from "../../../../types/users";
import { UserDto } from "../dto/user.dto";
import { BaseRepository } from "../repositories/baseRepository";
import { UserRepository } from "../repositories/userRepository";
import { LocationService } from "./LocationService";
import { fromUserToDto, fromDtoToUser } from "../mappers/user.mapper";
import { Location } from "../../../../types/locations";


const userBaseRepository = new BaseRepository<User>("users");
const locationBaseRepository = new BaseRepository<Location>("locations");
export class UserService {
  private userRepository: UserRepository = new UserRepository();

  public async getAllUsers({
    filters = {},
    sort = { createdAt: 1 },
    page = 1,
    limit = 9999,
  }: {
    filters?: Partial<User>;
    sort?: { [key: string]: 1 | -1 };
    page?: number;
    limit?: number;
  }): Promise<{ users: UserDto[]; total: number }> {
    const { data } = await this.userRepository.getFilteredAndPaginated(filters, sort, page, limit);

    const usersDTO = data.map((user: User) => this.mapToDTO(user));
    return { users: usersDTO, total: data.length };
  }

  public async getUserById(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.getById(id);
    return user ? fromUserToDto(user) : null;
  }

  public async getUsersByRole(role: string): Promise<UserDto[] | null> {
    const userRole = role as UserRole;
    const users = await this.userRepository.filter({ role: userRole });
    if (!users || users.length === 0) {
      return null;
    }
    return users.map((user: User) => this.mapToDTO(user));
  }

  public async createUser(userDTO: UserDto): Promise<UserDto> {
    const locationService: LocationService = new LocationService();
    console.log("userDTO.locationId:", userDTO.locationId);
    if (!userDTO.email || !userDTO.name || !userDTO.role || !userDTO.status) {
      throw new Error("Email, name, role and status are required to create a user");
    }

    const existingUser = await this.userRepository.filter({ email: userDTO.email });
    if (existingUser.length > 0) {
      throw new Error(`User with email ${userDTO.email} already exists`);
    }

    const user = fromDtoToUser(userDTO);

    const createdUser = await this.userRepository.insert(user);
    if (!createdUser) {
      throw new Error("Failed to create user");
    }
    if (createdUser.role === "location_rabbi") {
      try {
        const newLocation = await locationService.updateRabbiForLocation(createdUser.locationId!, createdUser.email);
        console.log("Location updated:", newLocation);
      } catch (err) {
        console.error("❌ שגיאה בעדכון מיקום לרב:", err);
      }
    }
    return fromUserToDto(createdUser);
  }

  public async updateUser(id: string, userDTO: Partial<UserDto>, skipUserUpdate: boolean = false): Promise<UserDto | null> {
    const locationService: LocationService = new LocationService();
    const oldUser = await this.getUserById(id);    
    if(oldUser!.role == "location_rabbi" && userDTO.role != "location_rabbi"){
      const locations = await locationBaseRepository.filter({ rabbiId: id });
      for(const loc of locations){
        await locationService.removeRabbiFromLocation(loc.id);
      }      
    }
    const updatedUser = await this.userRepository.update(id, userDTO as User);
    if (!updatedUser) throw new Error("filed updating user");
    if (!skipUserUpdate && updatedUser.role == "location_rabbi") {
      const newLocation = await locationService.updateRabbiForLocation(updatedUser!.locationId!, updatedUser!.email, true);
    }
    return updatedUser ? fromUserToDto(updatedUser) : null;
  }

  public async deleteUser(id: string): Promise<boolean> {
    await this.userRepository.delete(id);
    return !(await this.userRepository.getById(id));
  }

  private mapToDTO(user: User): UserDto {
    const { id, google_id, token, ...dto } = user;
    return dto;
  }

  public async getIdByEmail(emailToFind: string): Promise<string> {
    const usersWithEmail = await userBaseRepository.filter({ email: emailToFind });
    const id = usersWithEmail[0].id;
    return id;
  }
}
