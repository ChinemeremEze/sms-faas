//I Ezeakudolu David, 000778050 certify that this material is my original work. No other person's
//work has been used without due acknowledgement. I have not made my work available to anyone else 
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const events = require('events');
const Database = require('./lib/database.js');
const Redis = require('./lib/redis.js');

//  Allows us to broadcast events in our application
//  This is not the only way to do this - you can use
//  socket.io, for example.
const emitter = new events.EventEmitter();

//  We pass the emitter to our redis class so we can
//  use it to broadcast an event.
const redis = new Redis(emitter);

//  Init database for later
let database = new Database('./api.db');
//  We're listening for new messages
emitter.on('new-message', async function(message) {
   let new_status = message.status;
   let new_message  = message.message;
    let add_message = await database.add_message(new_status,new_message);
    //  While this works - make sure you check the requirements for Lab 4.
    //  Here, you will still need to insert the record into the SQLite database

    console.log('New message!', 'Find me in ./server.js', message);
    //  Use sockets to talk to the front-end/client/dashboard.mustache
    io.emit('new-message', message);
})


// include the mustache template engine for express
const mustacheExpress = require('mustache-express');

// registers the mustache engine with Express
app.engine("mustache", mustacheExpress());

// sets mustache to be the view engine
app.set('view engine', 'mustache');

// sets /views to be the /views folder
// files should have the extension filename.mustache
app.set('views', __dirname + '/views');

app.get('/dashboard', async function(req, res) {

    let messages = await database.get_messages();

    let data = {
        title: "Dashboard",
        items: messages,
    }

    res.render('dashboard', data);

});

app.get(/^(.+)$/, function(req,res) {
    console.log("static file request: " + req.params[0]);
    res.sendFile(__dirname + req.params[0]);
});

var server = http.listen(3000, function() {
  console.log("server listening...");
});
