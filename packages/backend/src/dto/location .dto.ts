export interface AddressCreateDto {
  country: string;
  city: string;
  street: string;
  houseNumber: string;
}

export interface AddressUpdateDto {
  country?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
}

export interface AddressDto extends AddressCreateDto {
  id: number;
}

export interface CreateLocationDto {
  name: string;
  phone: string;
  address: AddressCreateDto; 
}

export interface UpdateLocationDto {
  name?: string;
  phone?: string;
  address?: AddressUpdateDto;
}

export interface LocationResponseDto {
  id: string;
  rabbiName?: string;
  rabbiId?: string | null;
  name: string;
  phone: string;
  createdAt: Date;
  address: AddressDto;
  addressId: number;
  countAll: number;
  countReady: number;
}