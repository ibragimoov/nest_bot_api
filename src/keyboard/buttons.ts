import {Action} from "../constants/actions";
import { Markup } from "telegraf";

export class Buttons {
    ACTION_TO_PRODUCT() {
        return Markup.inlineKeyboard([
            [
                {text: Action.ACCEPT, callback_data: Action.ACCEPT},
                {text: Action.DENY, callback_data: Action.DENY}
            ],
            [
                {text: Action.READY_TO_BE_ISSUED, callback_data: Action.READY_TO_BE_ISSUED}
            ]
        ])
    }

    ACCEPT_DELETE() {
        return Markup.inlineKeyboard([
            [
                {text: Action.YES_DELETE, callback_data: Action.YES_DELETE}, 
                {text: Action.NO_DELETE, callback_data: Action.NO_DELETE}
            ]
        ])
    }

    ACCEPT_ORDER() {
        return Markup.inlineKeyboard([
            [
                {text: Action.ACCEPTED, callback_data: Action.ACCEPTED}
            ]
        ])
    }

    DENY_ORDER() {
        return Markup.inlineKeyboard([
            [
                {text: Action.INCORRECT_NAME, callback_data: Action.INCORRECT_NAME}
            ],
            [
                {text: Action.INCORRECT_VALUE, callback_data: Action.INCORRECT_VALUE}
            ]
        ])
    }

    SET_AUTH() {
        return Markup.keyboard([
            [Action.LOGIN],
            [Action.FAQ]
        ]
        ).resize()
    }

    SET_MAIN_MENU() {
        return Markup.keyboard(
            [
                [Action.MAKE_ORDER, Action.VIEW_ORDERS],
                [Action.FAQ]
            ]
        ).resize()
    }

    SET_VERIFY_ORDER() {
        return Markup.keyboard(
            [
                [Action.CONTINUE, Action.SEND_ORDER],
                [Action.MAIN_MENU]
            ]
        ).resize()
    }

    BACK_BUTTON() {
        return Markup.keyboard([Action.BACK])
        .resize()
    }

    BACK_TO_MENU() {
        return Markup.keyboard([Action.BUTTON_MAIN_MENU])
        .resize()
    }
}