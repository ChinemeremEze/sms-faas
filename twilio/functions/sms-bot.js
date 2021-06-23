//I Ezeakudolu David, 000778050 certify that this material is my original work. No other person's
//work has been used without due acknowledgement. I have not made my work available to anyone else 
exports.handler = function(context, event, callback) {
    var redis = require('redis');
    var uniqid = require('uniqid');
    var axios = require('axios');
    var twiml = new Twilio.twiml.MessagingResponse();

    var redis_client = redis.createClient({
      url: process.env.REDIS_ENDPOINT,
      password: process.env.REDIS_PASSWORD
    });
    
    var incoming_message = event.Body.split(' ');
    var command = incoming_message[0].toLowerCase();
    var action = incoming_message[1];
    var details = incoming_message.splice(2).join(' ');

    switch(command) {
        case "update":
            let data = JSON.stringify({"message": action, "status": details, timestamp: (new Date()).getTime()});
            console.log('data', data);
            let key = uniqid();
  
           redis_client.hset("messages", key, data, redis.print);
            
            console.log(data.action);
            twiml.message('Message inserted');
  
            callback(null, twiml);
            break;
  
        case "astro":

            // Number of People in Space
            axios
              .get("http://api.open-notify.org/astros.json")
              .then((response) => {
                let { number, people } = response.data;

                let names = people.map((astronaut) => astronaut.name);
                twiml.message(`There are ${number} people in space.`);
                twiml.message(`They are ${names.join()}`);
                 return callback(null, twiml);
              })
             .catch((error) => {
                console.log(error);
               twiml.message(error);
                 return callback(error);
              });
          break;
            
        case "helpme":
            twiml.message('This is the help function.');
            twiml.message('Command for astronauts: astro.');
            twiml.message('Command for update: Update Status Message.');
            callback(null, twiml);
            break;

        default:
          twiml.message('No command starts with '+command+".");

          callback(null, twiml);
          break;
    }
  };
  