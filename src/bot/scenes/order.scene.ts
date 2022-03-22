import { Context, Wizard, WizardStep} from 'nestjs-telegraf';
import { Order } from 'src/entities/order.entity';
import { Buttons } from 'src/keyboard/buttons';
import { Scenes } from 'telegraf';
import { BotService } from '../bot.service';

@Wizard('order')
export class OrderScene {
    private buttons = new Buttons()
    private product: any = [];
    constructor(private userController: BotService) {}

    @WizardStep(1)
    async step1(@Context() ctx: Scenes.WizardContext) {
        await ctx.reply('Введите название товара. . .',
            this.buttons.BACK_TO_MENU())
            ctx.wizard.next();
    }

    @WizardStep(2)
    async step2(@Context() ctx: any) {
        ctx.wizard.state.chatId = ctx.chat.id;
        ctx.wizard.state.nameOrder = ctx.message.text;

        if (await ctx.wizard.state.nameOrder == null) {
            await ctx.reply('Стикеры не принимаем')
            for await (let member of this.product) delete this.product[member];
            return await ctx.scene.reenter('orderScene');
        }

        if (await ctx.wizard.state.nameOrder =='👈 в главное меню') {
            ctx.reply('Главное меню', 
            this.buttons.SET_MAIN_MENU());
            for (let member in this.product) delete this.product[member];
            return ctx.scene.leave()
        }

        await ctx.replyWithHTML('Введите количество товара. . .\nНапример: <b><i>5 кг</i></b>');
        ctx.wizard.next();
    }

    @WizardStep(3)
    async step3(@Context() ctx: any) {
        ctx.wizard.state.amount = ctx.message.text
    
        this.product.push({
            nameProduct: ctx.wizard.state.nameOrder,
            value: ctx.wizard.state.amount,
        })

        if (await ctx.wizard.state.amount == null) {
            await ctx.reply('Стикеры не принимаем')
            for await (let member of this.product) delete this.product[member];
            return await ctx.scene.reenter('orderScene');
        }

        if (await ctx.wizard.state.amount =='👈 в главное меню') {
            ctx.reply('Главное меню', 
            this.buttons.SET_MAIN_MENU());
            for (let member in this.product) delete this.product[member];
            return ctx.scene.leave()
        }

        let html = this.product.map((f: any) => {
            return `===================\n <b>📦Товар:</b> ${f.nameProduct}\n <b>⚖️Кол-во:</b> ${f.value}`
        }).join('\n');

        await ctx.reply('Корзина:')
        await ctx.replyWithHTML(`${html}`,
        this.buttons.SET_VERIFY_ORDER())
        
        ctx.wizard.next();
    }

    @WizardStep(4)
    async step4(@Context() ctx: any) {
        ctx.wizard.state.reply = ctx.message.text;

        if (await ctx.wizard.state.reply == null) {
            await ctx.reply('Стикеры не принимаем')
            for await (let member of this.product) delete this.product[member];
            return await ctx.scene.reenter('orderScene');
        }

        if (await ctx.wizard.state.reply == '👈 в главное меню') {
            ctx.reply('Главное меню', 
            this.buttons.SET_MAIN_MENU());
            for (let member in this.product) delete this.product[member];
            return ctx.scene.leave()
        }

        if (await ctx.wizard.state.reply == '📤 Оформить заказ') {
            ctx.wizard.state.orderId = Math.floor(Math.random() * (999 - 100 + 1) ) + 100;
            const user = await this.userController.findUserByChatId(ctx.wizard.state.chatId)
            const order = new Order()
            ctx.reply(user)
            order.product = this.product
            order.status = 'Новый'
            order.orderId = ctx.wizard.state.orderId
            order.createdAt = new Date()
            order.updatedAt = new Date()
            if (user) {
                order.user = user
            }

            await this.userController.saveOrder(order)

            this.product.forEach((products: any) => {
                this.userController.saveProducts(products)
            })

            const messageForChat = await this.userController.findOrderByCreatedAt(user, {$gte: new Date(new Date().getTime() - 1000 * 60 * 0.1)})
            await ctx.telegram.sendMessage('-1001737252482', messageForChat)

            for (let member in this.product) delete this.product[member];

            await ctx.reply('Заказ оформлен',
            this.buttons.SET_MAIN_MENU())
            ctx.scene.leave();
        }

        if (await ctx.wizard.state.reply == '📝 Добавить ещё товар') {
            ctx.scene.reenter('orderScene');
        }
    }
}