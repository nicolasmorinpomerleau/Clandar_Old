
const {google} = require('googleapis');
// const { promisify } = require('util');

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
  console.log('enter the function');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type:application/json, Accept');
  
  
  google.auth.getClient({
    // scopes: 'https://www.googleapis.com/auth/calendar.readonly',
    scopes: 'https://www.googleapis.com/auth/calendar',
  }).then(auth => {
    const calendar = google.calendar({version: 'v3', auth});

    console.log('To start the switch');
    console.log('Req: '+ req.body.instruction);
    console.log('Req 2: '+ req.instruction);
    switch (req.body.instruction) {
      case 'getDatesValues':
        console.log('getDatesValues');
// === read === 
  calendar.events.list({
      calendarId: '5shl6ad2n056oquag39idg64c0@group.calendar.google.com',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      console.log('events abou:  '+ events);
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
      // res.status(200).send('Good men!');
    });
// === read ===        
        res.send({events: events.length});
        break;
        
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
