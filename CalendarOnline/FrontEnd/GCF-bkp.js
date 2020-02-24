
const {google} = require('googleapis');
// const { promisify } = require('util');
var eventsN;
//var eventsAvailabilities = [];
console.log('1');
var event = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'end': {
    'dateTime': '2020-02-10T15:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'start': {
    'dateTime': '2020-02-10T13:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  // 'recurrence': [
  //   'RRULE:FREQ=DAILY;COUNT=2'
  // ],
 // 'attendees': [
   // {'email': 'aboumekh@gmail.com'}
    // {'email': 'sbrin@example.com'},
  //],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
};


exports.helloWorld = (req, res) => {
  var eventsAvailabilities = [];
  
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type:application/json, Accept');
  
  google.auth.getClient({
    // scopes: 'https://www.googleapis.com/auth/calendar.readonly',
    scopes: 'https://www.googleapis.com/auth/calendar',
  }).then(auth => {
    const calendar = google.calendar({version: 'v3', auth});
	console.log('2');
    switch (req.body.Instructions) {
      case 'getDatesValues':
        //console.log('il est à getDatesValues');
        console.log('3');
// === read === 
  calendar.events.list({
      calendarId: '5shl6ad2n056oquag39idg64c0@group.calendar.google.com',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, resp) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = resp.data.items;
      console.log('4');
      eventsN = events.length;
      if (events.length) {
        console.log('5');
      /*  for (var i=0; i < eventsAvailabilities.length; i++){
            delete eventsAvailabilities(i);
        };*/
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
         // console.log(`${start} - ${event.summary}`);
          console.log('6');
         // console.log(' event stringify: '+JSON.stringify(event));
          item = {};
          //item ["title"] = event.summary; no need for this parameter because we will put "available" all time.
          item ["start"] = event.start.dateTime;
          item ["end"]   = event.end.dateTime;
          eventsAvailabilities.push(item); 
        });
      } else {
        console.log('No upcoming events found.');
      }
       console.log('7');
       res.status(200).send(eventsAvailabilities);
    }); // end calendar.events.list

// === read ===        
           console.log('Final');
          //res.status(200).send(eventsAvailabilities);
          break;
 
       // Object.keys(eventsAvailabilities).forEach(k => delete eventsAvailabilities[k]);
        
      case 'updatesDatesValues':
        console.log('updatesDatesValues');
    //  ==== insert ===
    calendar.events.insert({
      auth: auth,
      calendarId: '5shl6ad2n056oquag39idg64c0@group.calendar.google.com',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.htmlLink);
    });

    //  ==== insert ===
        res.status(200).send({updates: 'done'});
        break;
        
      default:
        console.log('pas de correspondance');
    }
 
  })
    // This just prints out all Worksheet names as an example
    // .then(({ data: {calendar} }) => {
    //   res.status(200).send({calendar});
    // })
    // .catch(err => {
    //   res.status(500).send({ err });
    // })
};
