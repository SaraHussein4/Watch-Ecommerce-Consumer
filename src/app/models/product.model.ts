import { Brand } from './brand.model';
import { Category } from './category.model';
import { Image } from './image.model';
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: string;
  genderCategory: string;
  waterResistance: boolean;
  warrentyYears: number;
  colors: string[];
  sizes: string[];
  images: Image[];
  productBrand: Brand;
  category: Category;
}
