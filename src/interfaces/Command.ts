import { Message} from "discord.js";
import {Bot} from "../bot";

export interface Execute {
    (client: Bot, message: Message, args: any[]): Promise<unknown>
}

export interface Command {
    name: string
    category: string
    aliases?: string[]
    execute: Execute
}
