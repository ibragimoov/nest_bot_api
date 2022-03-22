import { Context, Wizard, WizardStep} from 'nestjs-telegraf';
import { Buttons } from 'src/keyboard/buttons';
import { Scenes } from 'telegraf';
import { BotService } from '../bot.service';

@Wizard('login')
export class LoginScene {
    private buttons = new Buttons()
    constructor(private userController: BotService) {}

    @WizardStep(1)
    step1(@Context() ctx: Scenes.WizardContext) {
        ctx.replyWithHTML('Введите номер телефона. . .\nНапример <b><i>+79781234567</i></b>',
        this.buttons.BACK_BUTTON())
        ctx.wizard.next()
    }

    @WizardStep(2)
    async step2(@Context() ctx: any) {
        let phone_text = ctx.message.text
            if (await phone_text =='👈 Назад') {
                ctx.reply(`Здравствуйте, ${ctx.from.first_name}`, 
                this.buttons.SET_AUTH())
                return ctx.scene.leave()
            }
            if (await this.userController.phoneSchema.isValid(phone_text)) {
                await ctx.reply('Анализирую базу данных. . .');
                let phone: number = Number(phone_text.slice(1, 12))
                const user = await this.userController.findUser(phone)

                if (user) {
                    await ctx.reply('Пользователь уже зарегистрирован.\nДоступ к приложению открыт',
                      this.buttons.SET_MAIN_MENU()
                    );

                    return ctx.scene.leave();

                } else {
                    const newUser = {
                        chatId: ctx.chat.id,
                        name: ctx.from.first_name,
                        phone: phone
                    }
                    
                    await this.userController.saveUser(newUser)
                    await ctx.reply('Номер телефона зарегистрирован\nОткрываю доступ к приложению. . .',
                    this.buttons.SET_MAIN_MENU())
                    
                    return ctx.scene.leave()
                }
            } else {
                ctx.replyWithHTML('<b>Error</b>: номер телефона записан <i>неправильно</i>')
            }
    }
}