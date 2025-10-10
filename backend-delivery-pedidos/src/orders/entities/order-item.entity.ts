import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items') // Tabela para os itens de cada pedido
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // Relacionamento: Muitos itens (OrderItem) pertencem a um único pedido (Order)
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}