import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';

@Controller('orders') // Todas as rotas aqui começarão com /orders
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Rota para criar um novo pedido.
   * O front-end deve enviar um POST para http://localhost:3000/orders
   * com os dados do DTO no corpo da requisição.
   */
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
}