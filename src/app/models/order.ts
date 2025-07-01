export interface Order {
    id :number;
    date:Date;
    status:string;
    amount:number;  
    orderAddress:OrderAddress;
    deliveryMethod:DeliveryMethod;
    deliveryMethodId:number;
    subTotal:number;
    userId:number;    
}

export interface OrderItem {
   productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface OrderAddress {
    firstName: string;
  lastName: string;
  street: string;
  city: string;
  Governorate: Governorate;
    
}

export interface Governorate {
    id :number;
    name:string;
    deliveryCost:number;
    
}
export interface DeliveryMethod {
    id :number;
    shortName:string;
    description:string;
    deliveryTime:string;
    cost:number;
}

