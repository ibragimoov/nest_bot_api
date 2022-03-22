import { ApiProperty } from "@nestjs/swagger";
import {Entity, ObjectID, ObjectIdColumn, Column, OneToMany, JoinColumn} from "typeorm";
import { Order } from "./order.entity";

@Entity('users')
export class User {

    @ObjectIdColumn()
    id: ObjectID

    @ApiProperty()
    @Column()
    chatId: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    phone: number;

    @OneToMany(() => Order, order => order.user)

    @JoinColumn()
    order: Order[]
}