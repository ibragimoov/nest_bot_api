import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class AppService{
    constructor(
        @InjectRepository(User) private userRepository: Repository<User> 
    ) {}

    getHello(): string {
        return 'Hello World!'
    }

    getUsers(): Promise<User[]> {
        return this.userRepository.find()
    }

    async getOneByChatId(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOneOrFail({chatId: id})
            return user
        } catch (error) {
            throw error
        }
    }

}