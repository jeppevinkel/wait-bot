import {Execute} from "../../interfaces/Event";

export const execute: Execute = async (client) => {
    console.log(client.user.username, 'is now online!')
}

export const name: string = 'ready'
