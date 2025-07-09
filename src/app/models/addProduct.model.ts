export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  // status: string;
  genderCategory: string;
  waterResistance: boolean;
  warrentyYears: number;
  colors: string[];
  sizes: string[];
  productBrandId: number;
  categoryId: number;
  images: File[]; // FormData-compatible
}
