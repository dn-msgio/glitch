var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');


module.exports = function(controller) {

    controller.hears([/^\d{5}$/], 'direct_message,direct_mention', function(bot, message) {
        var textArray = message.text.split(" ");
        var zip;
        var re = /^\d{5}$/;
        for (var i = 0; i < textArray.length; i++) {
            if (re.test(textArray[i])) {
                zip = textArray[i];
            }
        }

        var forecast = new Forecast({
              service: 'darksky',
              key: process.env.forecastAPIKey,
              units: 'fahrenheit',
              cache: true,      // Cache API requests
              ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
                minutes: 27,
                seconds: 45
              }
        });

        var options = {
            provider: 'google',
            httpAdapter: 'https',
            apiKey: 'TEST',
            formatter: null
        };

        var geocoder = NodeGeocoder(options);
        var latitude;
        var longitude;
        geocoder.geocode(zip, function(err, res) {
           var resObject = res[0];
           latitude = resObject["latitude"];
           longitude = resObject["longitude"];

            forecast.get([latitude, longitude], function(err, weather) {
              if(err) return console.dir(err);
              //console.dir(weather);
              var daily = weather["daily"];
              var summary = daily["summary"];

                bot.startConversation(message, function(err, convo) {
                    convo.say('You are requesting the weather in ' + zip);
                    convo.say('In ' + zip + ' the forecast is: ' + summary);
                });

            });
        });
    });


    controller.hears(['help'], 'direct_message,direct_mention', function(bot, message) {

        bot.reply(message, 'Please provide me with a 5 digit zip code and I will give you the forecast for that location!');

    });

};
