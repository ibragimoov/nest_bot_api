import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { MongoRepository } from 'typeorm';
import * as yup from 'yup'

@Injectable()
export class BotService {
	constructor(
		@InjectRepository(User)	private userRepository: MongoRepository<User>,
		@InjectRepository(Order) private orderRepository:  MongoRepository<Order>,
    	@InjectRepository(Product) private productRepository:  MongoRepository<Product>,
	  ) {}

	public phoneSchema = yup.string().matches(/^\+[0-9]{3}(\d+)\d{3}\d{2}\d{2}/g).required().max(12);
	public moment = require('moment');

	echo(text: string): string {
		return `Echo: ${text}`;
	}

	async findUser(phone: number): Promise<User> {
        return await this.userRepository.findOne({where: {phone: phone}})
    }

	async saveUser(body: object): Promise<User> {
        return await this.userRepository.save(body)
    }

	async findUserByChatId(chatId: number) {
        return await this.userRepository.findOne({where: {chatId: chatId}})
    }

	async saveOrder(body: object) {
        await this.orderRepository.save(body)
    }

    async saveProducts(body: object) {
        await this.productRepository.save(body)
    }

	async findOrderByCreatedAt(user: any, query: any) {
        return this.orderRepository.find({user: user, createdAt: query})
            .then(async orders => {
            let count = 0,
            order_msg = ''

            order_msg = orders.map ((f, i) => {
                count++;
                return `=========================\n Заказ #${i + 1}\n ✅Статус: ${f.status}\n 📅Обновлен: ${this.moment(f.updatedAt).format('DD.MM.YYYY HH:mm')}\n 🔎Подробнее: /c${f.orderId}`;
            }).join('\n');

            return order_msg += `\n=========================\n\nЗаказчик:   ${user.name}\nID пользователя: -${user.chatId}\n`
        });
    }
}
