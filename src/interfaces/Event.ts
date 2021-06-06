import { Message} from "discord.js";
import {Bot} from "../bot";

export interface Execute {
    (client: Bot, ...args: any[]): Promise<unknown>
}

export interface Event {
    name: string
    execute: Execute
}
