import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { LoginScene } from './scenes/login.scene';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { OrderScene } from './scenes/order.scene';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Order,
    Product
  ])],
  providers: [BotUpdate, BotService, LoginScene, OrderScene]
})
export class BotModule {}