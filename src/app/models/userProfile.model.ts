import { Address } from "./adress.model";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  addresses: Address[];
}
