import {
  Start,
  Update,
  Hears,
  InjectBot,
  On,
  Command,
  Help,
  Message,
  Ctx,
} from 'nestjs-telegraf';
import { Action } from 'src/constants/actions';
import { Telegraf } from 'telegraf';
import { BotService } from './bot.service';
import { Context } from '../interfaces/interfaces'
import { Controller, Get } from '@nestjs/common';
import { Buttons } from 'src/keyboard/buttons';

@Update()
export class BotUpdate {
	constructor(
	@InjectBot('nest')
	private readonly bot: Telegraf<Context>,
	private readonly botService: BotService,
	) {}

	private buttons = new Buttons()

	@Start()
	@Get('start')
	async onStart(ctx: Context) {
		try {
			if (ctx.chat.type == 'private') {
				ctx.reply(`Здравствуйте, ${ctx.chat.first_name}`, 
					this.buttons.SET_AUTH()
				);
			} else {
				ctx.reply(`Бот запущен в группе - ${ctx.chat.id}`)
			}
		} catch (e) {
			console.log(e);
		}
	}

	@Hears(Action.FAQ)
	async FAQ(ctx: Context) {
		await ctx.replyWithPhoto('https://sun9-36.userapi.com/impg/u-4a-1vB1cOaiO0FtLJ3l1SvQjfLFYItSxmHiw/x6Joh4eHV4Y.jpg?size=609x471&quality=96&sign=e7553e7be1256d84f6b65a683d18f04f&type=album')

		await ctx.reply('Команда разработчиков состоит из двух человек\nЕсли увидите ошибки, пишите сюда: help@mail.ru\n\nДанный бот является посредником между покупателем и продавцом\n\n');
	}

	@Hears(Action.LOGIN)
	async Login(@Ctx() ctx: Context): Promise<void> {
    	await ctx.scene.enter('login');
  	}

	@Hears(Action.MAKE_ORDER)
	async Order(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter('order');
	}

	@Help()
	async onHelp(): Promise<string> {
		return 'Send me any text';
	}

	@Command('admin')
	onAdminCommand(): string {
		return 'Welcome judge';
	}

	@On('text')
	onMessage(
	@Message('text') reversedText: string,
	): string {
		return this.botService.echo(reversedText);
	}


}
