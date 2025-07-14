import { Address } from "./adress.model";

export interface Delivery {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  buildingNumber?: number;
  street?: string;
  state?: string;
  isDefault?: boolean;
  governorateId: number | null;
  governorateName?: string | null;
  addresses?: Address[];
}