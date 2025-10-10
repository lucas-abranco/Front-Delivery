import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { deliveryAddress, paymentMethod, items } = createOrderDto;

    // 1. Calcula o total do pedido no back-end para segurança
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 2. Cria as instâncias dos itens que serão salvos
    const orderItems = items.map((itemDto) => {
      const newItem = new OrderItem();
      newItem.productName = itemDto.productName;
      newItem.quantity = itemDto.quantity;
      newItem.price = itemDto.price;
      return newItem;
    });

    // 3. Cria a instância do pedido principal e associa os itens
    const newOrder = this.orderRepository.create({
      deliveryAddress,
      paymentMethod,
      total,
      items: orderItems, // O TypeORM entende e salva os itens relacionados
    });

    // 4. Salva o pedido completo (incluindo os itens) no banco de dados
    return this.orderRepository.save(newOrder);
  }
}