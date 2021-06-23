const redis = require('redis');
const dotenv = require('dotenv').config();
const uniqid = require('uniqid');

class Redis {
    constructor(emitter) {
        this.emitter = emitter;
        this.client = redis.createClient(
            {
                url: process.env.REDIS_ENDPOINT,
                password: process.env.REDIS_PASSWORD
            }
        );

        this.client.on("error", (err) => {
            console.log("Error " + err);
        });

        // This example gives us a great way to monitor for changes to redis store:
        // https://github.com/NodeRedis/node-redis/blob/master/examples/monitor.js

        this.client.monitor(function(err, res) {
            console.log('Entering monitoring mode.');
        });
        
        this.client.on("monitor", function(time, args) {
            console.log(args)
            //  A new message has come in
            if(args[1] == 'messages') {
                let id = args[2];
                let message = JSON.parse(args[3]);

                console.log(`A new message has arrived: \n\nID: ${id}\nMessage: ${message.message}\nStatus: ${message.status}\nTimestamp: ${message.timestamp}`);

                //  Let anyone listening know that we have received a new message
                emitter.emit('new-message', {'id': id, 'message': message.message, 'status': message.status, 'timestamp': message.timestamp});
            }
        });
    }

    quit() {
        this.client.quit();
    }

    async get_messages() {
        return new Promise((resolve, reject) => {
            let filtered_replies = [];
            this.client.hgetall("messages", function (err, replies) {
                if (err) {
                    return reject(err);
                }

                for (const [key, value] of Object.entries(replies)) {
                    let reply = JSON.parse(value);
                    filtered_replies.push({message: reply.message, status: reply.status, timestamp: reply.timestamp});
                }

                resolve(filtered_replies);
            });
        });
    }

    async add_message(message, status, timestamp) {
        let data = JSON.stringify({"message": message, "status": status, "timestamp": timestamp});
        let key = uniqid();
        this.client.hset("messages", key, data, redis.print);
    }
}

module.exports = Redis;