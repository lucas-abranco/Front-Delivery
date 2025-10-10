import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'delivery.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Em desenvolvimento, cria/atualiza as tabelas automaticamente
    }),
    OrdersModule, // Registra nosso módulo de pedidos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}