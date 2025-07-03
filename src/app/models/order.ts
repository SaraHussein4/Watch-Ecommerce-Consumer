export interface Order {
  id: number;
  date: Date;
  status: string;
  amount: number;
  orderAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  deliveryMethodId: number;
  subTotal: number;
  userId: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  deliveryMethodId: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  city: string;
  street: string;
  governorateId: number;
}

export interface Governorate {
  id: number;
  name: string;
  deliveryCost: number;
}

export interface DeliveryMethod {
  id: number;
  shortName: string;
  description: string;
  deliveryTime: string;
  cost: number;
}


