
const {google} = require('googleapis');
// const { google } = require('googleapis');
const { promisify } = require('util');

exports.helloWorld = (req, res) => {
  google.auth.getClient({
    // scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    scopes: 'https://www.googleapis.com/auth/calendar.readonly',
  }).then(auth => {
    console.log('  first Log  ');
    // const api = google.sheets({ version: 'v4', auth });

    // == For Calendar ==
    const calendar = google.calendar({version: 'v3', auth});
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
    });
    // == For Calendar ==


    // console.log('api abou: '+ api);
    // const getSheets = promisify(api.spreadsheets.get.bind(api.spreadsheets));
    // spreadsheetId = '11WPbTI4H76Rfbg9BpfHBLUrfaovmcv9hvFvdSGdGHHo';
// ===
    // const sheets = google.sheets({version: 'v4', auth});

// ===
    //  getSheets({ spreadsheetId: '11WPbTI4H76Rfbg9BpfHBLUrfaovmcv9hvFvdSGdGHHo' });

    // return getSheets({ spreadsheetId: '11WPbTI4H76Rfbg9BpfHBLUrfaovmcv9hvFvdSGdGHHo' });
  })
    // This just prints out all Worksheet names as an example
    .then(({ data: { sheets } }) => {
      console.log('  second Log  ');

      // ===
      // api.spreadsheets.values.get({
      //   spreadsheetId: spreadsheetId,
      //   range: 'Calendar!A1:D',
      // }, (err, res) => {
      //   if (err) return console.log('The API returned an error: ' + err);
      //   const rows = res.data.values;
      //   console.log('rows: '+ rows);
      //   if (rows.length) {
      //     console.log('Name, Major:');
      //     // Print columns A and E, which correspond to indices 0 and 4.
      //     rows.map((row) => {
      //       console.log(`${row[0]}, ${row[3]}`);
      //     });
      //   } else {
      //     console.log('No data found.');
      //   }
      // });
      // ===
      res.status(200).send({ sheets });
    })
    .catch(err => {
      res.status(500).send({ err });
    })

//   var jwt = getJwt();
//   var apiKey = getApiKey();
// //   var GCalendar1 = '5shl6ad2n056oquag39idg64c0@group.calendar.google.com';
//   var spreadsheetId = '11WPbTI4H76Rfbg9BpfHBLUrfaovmcv9hvFvdSGdGHHo';
//   var range = 'A1';
//   var row = [new Date(), 'A Cloud Function was here'];
//   appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
//   console.log('jwt: '+jwt);
//   console.log('range: '+range);
//   console.log('row: '+ row);
//   res.status(200).type('text/plain').end('OK');
};

//== New Option ==
// exports.main = (req, res) => {
//   google.auth.getClient({
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//   }).then(auth => {
//     const api = google.sheets({ version: 'v4', auth });
//     const getSheets = promisify(api.spreadsheets.get.bind(api.spreadsheets));
//     return getSheets({ spreadsheetId: '11WPbTI4H76Rfbg9BpfHBLUrfaovmcv9hvFvdSGdGHHo' });
//   })
//     // This just prints out all Worksheet names as an example
//     .then(({ data: { sheets } }) => {
//       res.status(200).send({ sheets });
//     })
//     .catch(err => {
//       res.status(500).send({ err });
//     })
// };
// == New Option ==

// function getJwt() {
//   var credentials = require("./credentials.json");
//   return new google.auth.JWT(
//     credentials.client_email, null, credentials.private_key,
//     ['https://www.googleapis.com/auth/spreadsheets']
//   );
// }

// function getApiKey() {
//   var apiKeyFile = require("./api_key.json");
//   console.log('apiKeyFile.key: '+apiKeyFile.key);
//   return apiKeyFile.key;
// }

/**
 * Lists the next 10 events on the user's primary calendar.
 */
// function listEvents(auth) {
//     const calendar = google.calendar({version: 'v3',auth});
//     calendar.events.list({
//       calendarId: 'primary',
//       timeMin: (new Date()).toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const events = res.data.items;
//       if (events.length) {
//         console.log('Upcoming 10 events:');
//         events.map((event, i) => {
//           const start = event.start.dateTime || event.start.date;
//           console.log(`${start} - ${event.summary}`);
//         });
//       } else {
//         console.log('No upcoming events found.');
//       }
//     });
//   }

// function appendSheetRow(jwt, apiKey, spreadsheetId, range, row) {
//   const sheets = google.sheets({version: 'v4'});
//   sheets.spreadsheets.values.append({
//     spreadsheetId: spreadsheetId,
//     range: range,
//     auth: jwt,
//     key: apiKey,
//     valueInputOption: 'RAW',
//     resource: {values: [row]}
//   }, function(err, result) {
//     if (err) {
//       console.log('voici ton erreur: '+ err);
//       throw err;
//     }
//     else {
//       console.log('Updated sheet: ' + result.data.updates.updatedRange);
//     }
//   });
// }



// function listMajors(auth) {
//   const sheets = google.sheets({version: 'v4', auth});
//   sheets.spreadsheets.values.get({
//     spreadsheetId: spreadsheetId,
//     range: 'Calendar!A1:D',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const rows = res.data.values;
//     if (rows.length) {
//       console.log('Name, Major:');
//       // Print columns A and E, which correspond to indices 0 and 4.
//       rows.map((row) => {
//         console.log(`${row[0]}, ${row[4]}`);
//       });
//     } else {
//       console.log('No data found.');
//     }
//   });
// }