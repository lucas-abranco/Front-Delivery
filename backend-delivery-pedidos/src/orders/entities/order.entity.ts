import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

// Enum para controlar o status do pedido
export enum OrderStatus {
  PENDING = 'Pendente',
  PREPARING = 'Em Preparo',
  ON_THE_WAY = 'A Caminho',
  DELIVERED = 'Entregue',
  CANCELED = 'Cancelado',
}

@Entity('orders') // Define o nome da tabela no banco de dados
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Futuramente, aqui entraria o ID do usuário. Por enquanto, pode ser um nome ou e-mail.
  @Column({ default: 'cliente@exemplo.com' })
  customerEmail: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column()
  deliveryAddress: string;

  @Column()
  paymentMethod: string;

  @Column({
    type: 'simple-enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // Relacionamento: Um pedido (Order) pode ter vários itens (OrderItem)
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}