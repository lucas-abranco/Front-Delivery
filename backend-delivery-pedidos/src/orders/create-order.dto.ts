// DTO: Data Transfer Object
// Define a "forma" dos dados que chegam na nossa API
export class CreateOrderDto {
  readonly deliveryAddress: string;
  readonly paymentMethod: string;
  readonly items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}