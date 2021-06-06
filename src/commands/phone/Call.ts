import { Execute } from "../../interfaces/Command";
import {CallType} from "../../phone";

export const execute: Execute = async (client, message, args) => {
    console.log('CALL')
    if (args.length > 0 && args[0] == 'embed') {
        client.phone.openConnection(message.channel, CallType.embed)
    } else if (args.length > 0 && args[0] == 'anon') {
        client.phone.openConnection(message.channel, CallType.anonymous)
    } else {
        client.phone.openConnection(message.channel)
    }
}

export const name: string = 'call'
// export const aliases: string[] = [ ]
export const category: string = 'phone'
export const usage: string = 'call [embed|anon]'
