import { PaymentItems } from './payment-items';
export interface Payment {
  paymentInterntId: string;
  clientSecret: string;
  deliveryMethodId: number;
  id: string;
  items: PaymentItems[];
}
