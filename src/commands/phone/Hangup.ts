import { Execute } from "../../interfaces/Command";

export const execute: Execute = async (client, message, args) => {
    client.phone.closeConnection(message.channel)
}

export const name: string = 'hangup'
export const aliases: string[] = [ ]
export const category: string = 'phone'
export const usage: string = 'hangup'
