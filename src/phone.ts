import {Channel, Client, DMChannel, Message, NewsChannel, TextChannel} from "discord.js";

export class Phone {
    public connections: Array<PhoneConnection> = Array<PhoneConnection>()
    public awaitingConnection: Array<TextChannel | DMChannel | NewsChannel> = Array<TextChannel | DMChannel | NewsChannel>()

    public openConnection(channel: TextChannel | DMChannel | NewsChannel) {
        channel.send('**Opening connection...**')
        if (this.awaitingConnection.length) {
            let channel2 = this.awaitingConnection.pop()
            let phoneConnection = new PhoneConnection(channel2, channel)
            this.connections.push(phoneConnection)

            phoneConnection.channels[0].send('**Phone connection established!**')
            phoneConnection.channels[1].send('**Phone connection established!**')
        } else {
            this.awaitingConnection.push(channel)
        }
    }

    public closeConnection(channel: TextChannel | DMChannel | NewsChannel) {
        for (const connection of this.connections) {
            if (connection.channels.includes(channel)) {
                let distChannel = connection.channels[(connection.channels.indexOf(channel) + 1) % 2]

                channel.send('**You hung up the phone.**').catch(err => {
                    console.log('Error: ', err)
                })

                distChannel.send(`**The other party hung up the phone.**`).catch(err => {
                    console.log('Error: ', err)
                })

                this.connections.splice(this.connections.indexOf(connection), 1)
            }
            else {
                channel.send('**There are currently no connections open to this channel.**')
            }
        }
    }

    public sendMessage(client: Client, message: Message) {
        for (const connection of this.connections) {
            if (connection.channels.includes(message.channel)) {
                let distChannel = connection.channels[(connection.channels.indexOf(message.channel) + 1) % 2]

                distChannel.send(`**${message.author.username}**: ${message.content}`).catch(err => {
                    console.log('Error: ', err)
                })
            }
        }
    }
}


class PhoneConnection {
    channels: [TextChannel | DMChannel | NewsChannel, TextChannel | DMChannel | NewsChannel]

    constructor(channel1: TextChannel | DMChannel | NewsChannel, channel2: TextChannel | DMChannel | NewsChannel) {
        this.channels = [channel1, channel2]
    }

}
