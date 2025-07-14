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
  paymentStatus: string;
}

export interface OrderOverview {
  id: number;
  date: Date;
  status: string;
  amount: number;
  email: string;
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
  paymentMethod: string;
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




export interface OrderDto {
  id: number;
  date: Date;
  status: string;
  subTotal: number;
  amount: number;
  orderAddress: OrderAddressDto;
  orderItems: OrderItemDto[];
  deliveryMethod?: DeliveryMethodDto;
  paymentMethod: string;
  paymentStatus: string;
}

export interface OrderAddressDto {
  firstName: string;
  lastName: string;
  city: string;
  street: string;
  governorateId: number;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface DeliveryMethodDto {
  id: number;
  shortName: string;
  description: string;
  deliveryTime: string;
  cost: number;
}

export interface ReturnRequestDto {
  orderId: number;
  returnReason: string;
  returnItems: ReturnItemDto[];
}

export interface ReturnItemDto {
  orderItemId: number;
  quantityToReturn: number;
  reason: string;
}