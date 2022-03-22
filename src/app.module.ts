import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import configOrm from 'ormconfig';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { BotModule } from './bot/bot.module';
import { config } from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { sessionMiddleware } from './middleware/session';

config()

@Module({
    imports: [
        TypeOrmModule.forRoot(configOrm), 
        
        TypeOrmModule.forFeature([
            User,
            Order,
            Product
        ]),
        
        TelegrafModule.forRoot({
            token: process.env.BOT_TOKEN,
            botName: 'nest',
            include: [BotModule],
            middlewares: [sessionMiddleware]
        }),
        BotModule,
    ],
    controllers: [AppController],
    providers: [AppService]
    })
export class AppModule {}
