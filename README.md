# Lab 4
### Structure/Guide

For more information, read the Overview for Week 7, 8 and 9 in Canvas.

### Development

Is this your first time? Make sure to: 
* save ./.env.blank as ./.env, then ensure all environment variables have a value.
* save ./twilio/.env.blank as ./twilio/.env, then ensure all environment variables have a value.
* run `npm run setup` to install dependancies for ./package.json and ./twilio/package.json

To run: 
* Nodemon: `npm run dev`
* Node: `node .`

### Deployment

To deploy:
* `npm run deploy`

### Notes

* In package.json you'll notice that nodemon is running with the exec (-e) option. This is to include .mustache templates when monitoring for changes.

### Help

* Working with APIs and Twilio FaaS: https://www.twilio.com/docs/runtime/quickstart/serverless-functions-make-a-read-request-to-an-external-api
* Using Redis Monitor event to check for changes: https://github.com/NodeRedis/node-redis/blob/master/examples/monitor.js
* Installing Twilio CLI: https://www.twilio.com/docs/twilio-cli/quickstart
* Twilio Serverless project structure: https://www.twilio.com/docs/labs/serverless-toolkit/general-usage#project-structure
* Events in Node: https://blog.logrocket.com/handling-and-dispatching-events-with-node-js/
* Twilio FaaS templates: https://github.com/twilio-labs/function-templates