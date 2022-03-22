import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Context } from "telegraf";
import { AppService } from "./app.service";
import { User } from "./entities/user.entity";

@ApiTags('app')
@Controller('app')
export class AppController{
    buttons: any;
    constructor(private readonly appService: AppService) {}

    @Get('hello')
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('users')
    getUsers(): Promise<User[]> {
        return this.appService.getUsers()
    }

    @Get('start')
	async FAQ(ctx: Context) {
		return await 'Команда разработчиков состоит из двух человек\nЕсли увидите ошибки, пишите сюда: help@mail.ru\n\nДанный бот является посредником между покупателем и продавцо'
	}

    @ApiOkResponse({type: User, description: 'the user'})
    @ApiNotFoundResponse()
    @Get(':id')
    async getOneByChatId(@Param('id') id: string): Promise<User> {
        const user = await this.appService.getOneByChatId(Number(id))

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }
}