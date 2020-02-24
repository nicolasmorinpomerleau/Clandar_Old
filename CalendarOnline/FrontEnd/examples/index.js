

function query(){
    $.post('https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ', { Instructions: 'query'}, function(result) {
      id = "5shl6ad2n056oquag39idg64c0@group.calendar.google.com";

    // console.log('result: ' + JSON.stringify(result));
    var startDate = new Date(),
        endDate = new Date();
        // console.log(startDate);
        // console.log(startDate.toISOString());
        var date = new Date();
        console.log('date '+date );
        var data = new Date(date.getTime() - date.getTimezoneOffset() * 60000) ;
  //  = (new Date()).toISOString();
  console.log('data: '+ data.toISOString());
    var rootStart = startDate,
        rootEnd = endDate;

    var interval = 2, // how big single slot should be (in this case 2 hrs) 
        freeSlots = [];
//    slotsFromEvents(startDate, result.busy);

    function slotsFromEvents(date,events) {
      events.forEach (myFunction1);
      // for (var i=0; i < events.length; i++){
      //   myFunction();
      // }
      function myFunction1 (event,i){
        if(startDate == event.start){
          startDate  = startDate + 1;
        }
        else{
          freeDates = startDate;
          freeSlots.push({startDate: freeDates, endDate: freeDates+1});
        }
      }

      function myFunction(event, index) { //calculate free from busy times
          if (index == 0 && startDate < event.start) {
              freeSlots.push({startDate: startDate, endDate: event.start});
          }
          else if (index == 0) {
              startDate = event.end;
          }
          else if (events[index - 1].end < event.start) {
              freeSlots.push({startDate: events[index - 1].end, endDate: event.start});
          }
          if (events.length == (index + 1) && event.end < endDate) {
              freeSlots.push({startDate: event.end, endDate: endDate});
          }
      };
    
      if (events.length == 0) {
          freeSlots.push({startDate: startDate, endDate: endDate});
      }
    
      var temp = {}, hourSlots = [];
      freeSlots.forEach(function(free, index) {
          var freeHours = new Date(free.endDate).getHours() - new Date(free.startDate).getHours(), freeStart = new Date(free.startDate), freeEnd = new Date(free.endDate);
          while(freeStart.getHours()+freeHours+interval>=0) { // 11 + 4 + 2 >= 0
              if(freeHours>=interval) {
                  temp.e = new Date(free.startDate);
                  temp.e.setHours(temp.e.getHours()+freeHours);
                  temp.s = new Date(free.startDate);
                  temp.s.setHours(temp.s.getHours()+freeHours-interval);
                  if(temp.s.getHours() >= rootStart.getHours() && temp.e.getHours() <= rootEnd.getHours()) {
                      hourSlots.push({calName: calObj.name, startDate:temp.s, endDate:temp.e});
                      temp = {};
                  }
              }
              freeHours--;
          }
      });
    // result.map((event, i) => {
    //     item = {};
    //     //item ["title"] = event.summary; no need for this parameter because we will put "available" all time.
    //     item ["title"] = "Disponible";
    //     item ["start"] = event.start;
    //     item ["end"]   = event.end;
    //     eventsAvailabilities.push(item); 
    //   });
      console.log('freeSlots: '+ JSON.stringify(freeSlots));
    };
  });
};

// Peut être utilisé pour le UI du coiffeur
function readDates(){
    $.post('https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ', { Instructions: 'getDatesValues'}, function(result) {
    var eventsAvailabilities = [];
    console.log('result: ' + JSON.stringify(result));

    result.map((event, i) => {
        // const start = event.start.dateTime || event.start.date;
       // console.log(`${start} - ${event.summary}`);
       // console.log(' event stringify: '+JSON.stringify(event));
        item = {};
        //item ["title"] = event.summary; no need for this parameter because we will put "available" all time.
        item ["title"] = "Disponible";
        item ["start"] = event.start;
        item ["end"]   = event.end;
        eventsAvailabilities.push(item); 
      });
console.log(JSON.stringify(eventsAvailabilities));
fillCalendar(eventsAvailabilities);
    });
};

function updateDates(){
    $.post('https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ', { Instructions: 'updatesDatesValues'}, function(result) {
    if(result.dates != undefined){
        alert('got dates! ');
    }

    });
  }

// Get current dates
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth();
var day = d.getDate();
var currentDate = new Date(year, month, day+1);

//   document.addEventListener('DOMContentLoaded', function() {
    function fillCalendar (eventsAvailabilities){
      // to not create multiple times the calendar
    //   var calendarEl = document.getElementById('calendar')
    //   if(calendarEl){
    //    var calendarTag = document.getElementById(calendarEl);
    //    calendarTag.parentNode.removeChild(calendarTag);
    //  }

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      // To display the date which is not an event yet
      dateClick: function(info) {
        alert('Date: ' + info.dateStr);
        alert('Resource ID: ' + info.resource.id);
      },
      // ========

      // To display an clicked event
      eventClick: function(info) {
      // alert('Event: ' + info.event.title);
      alert('Dates start ' + info.event.start + ' Dates End' + info.event.end);
      // alert('View: ' + info.view.type);

      // change the border color just for fun
      info.el.style.borderColor = 'red';
    },
    // ============
      plugins: ['interaction' , 'timeGrid' ],
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      // defaultDate: '2019-08-12',
      defaultDate : currentDate,
      navLinks: true, // can click day/week names to navigate views
      // businessHours: true, // display business hours
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        // daysOfWeek: [ 1, 2, 3, 4,5 ], // Monday - Thursday

        startTime: '08:00', // a start time (10am in this example)
        endTime: '18:00', // an end time (6pm in this example)
      },
      editable: true,
      weekends:false,
      allDaySlot:false,
      // slotDuration:'08:00:00',
      // timeZone: 'local',
      locale:'fr',
      events: eventsAvailabilities
      //[
    //     {
    //       title: 'Disponible',
    //       start: '2020-02-18T13:00:00',
    //       end:'2020-02-18T14:00:00',
    //       constraint: 'businessHours'
    //     },
    //     {
    //       title: 'Disponible',
    //       start: '2020-02-18T14:00:00',
    //       end:'2020-02-18T15:00:00',
    //       constraint: 'businessHours'
    //     },
    //     {
    //       title: 'Disponible',
    //       start: '2020-02-18T15:00:00',
    //       end:'2020-02-18T16:00:00',
    //       constraint: 'businessHours'
    //     },
    //     {
    //       title: 'Meeting',
    //       start: '2020-02-13T11:00:00',
    //       constraint: 'availableForMeeting', // defined below
    //       color: '#257e4a'
    //     },
    //     {
    //       title: 'Conference',
    //       start: '2020-02-18',
    //       end: '2020-02-18'
    //     },
    //     {
    //       title: 'Party',
    //       start: '2020-02-29T20:00:00'
    //     },

    //     // areas where "Meeting" must be dropped
    //     {
    //       groupId: 'availableForMeeting',
    //       start: '2019-08-14T10:00:00',
    //       end: '2019-08-15T16:00:00',
    //       rendering: 'background'
    //     },
    //     {
    //       groupId: 'availableForMeeting',
    //       start: '2019-08-13T10:00:00',
    //       end: '2019-08-13T16:00:00',
    //       rendering: 'background'
    //     },

    //     // red areas where no events can be dropped
    //     {
    //       start: '2019-08-24',
    //       end: '2019-08-28',
    //       overlap: false,
    //       rendering: 'background',
    //       color: '#ff9f89'
    //     },
    //     {
    //       start: '2019-08-06',
    //       end: '2019-08-08',
    //       overlap: false,
    //       rendering: 'background',
    //       color: '#ff9f89'
    //     }
    //   ]
    });
    calendar.render();
  };










//   const {google} = require('googleapis');
//   // const { promisify } = require('util');
//   var eventsN;
//   //var eventsAvailabilities = [];
//   console.log('1');
//   var event = {
//     'summary': 'Google I/O 2015',
//     'location': '800 Howard St., San Francisco, CA 94103',
//     'description': 'A chance to hear more about Google\'s developer products.',
//     'end': {
//       'dateTime': '2020-02-10T15:00:00-07:00',
//       'timeZone': 'America/Los_Angeles'
//     },
//     'start': {
//       'dateTime': '2020-02-10T13:00:00-07:00',
//       'timeZone': 'America/Los_Angeles'
//     },
//     // 'recurrence': [
//     //   'RRULE:FREQ=DAILY;COUNT=2'
//     // ],
//    // 'attendees': [
//      // {'email': 'aboumekh@gmail.com'}
//       // {'email': 'sbrin@example.com'},
//     //],
//     'reminders': {
//       'useDefault': false,
//       'overrides': [
//         {'method': 'email', 'minutes': 24 * 60},
//         {'method': 'popup', 'minutes': 10},
//       ],
//     },
//   };
  
  
//   exports.helloWorld = (req, res) => {
//     var eventsAvailabilities = [];
    
//     res.set('Access-Control-Allow-Origin', '*');
//     res.set('Access-Control-Allow-Methods', 'GET, POST');
//     res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type:application/json, Accept');
    
//     google.auth.getClient({
//       // scopes: 'https://www.googleapis.com/auth/calendar.readonly',
//       scopes: 'https://www.googleapis.com/auth/calendar',
//     }).then(auth => {
//       const calendar = google.calendar({version: 'v3', auth});
//       console.log('2');
//       switch (req.body.Instructions) {
//           case 'query':
//   // ================= Free\Busy =================
//   calendar.freebusy.query({
//     "timeMin": "2020-02-20T14:00:00-05:00",
//     "timeMax": "2020-02-20T20:00:00-05:00",
//     "items": [
//       {
//         "id": "5shl6ad2n056oquag39idg64c0@group.calendar.google.com"
//       }
//     ]
//     }, (err, resp) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       console.log(JSON.stringify(resp));
//      });
//      // ================= Free\Busy =================
//      break;
  
//         case 'getDatesValues':
//           //console.log('il est à getDatesValues');
//           console.log('3');
  
//   // === read === 
//     calendar.events.list({
//         calendarId: '5shl6ad2n056oquag39idg64c0@group.calendar.google.com',
//         timeMin: (new Date()).toISOString(),
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: 'startTime',
//       }, (err, resp) => {
//         if (err) return console.log('The API returned an error: ' + err);
//         const events = resp.data.items;
//         console.log('4');
//         eventsN = events.length;
//         if (events.length) {
//           console.log('5');
//         /*  for (var i=0; i < eventsAvailabilities.length; i++){
//               delete eventsAvailabilities(i);
//           };*/
//           events.map((event, i) => {
//             const start = event.start.dateTime || event.start.date;
//            // console.log(`${start} - ${event.summary}`);
//             console.log('6');
//            // console.log(' event stringify: '+JSON.stringify(event));
//             item = {};
//             //item ["title"] = event.summary; no need for this parameter because we will put "available" all time.
//             item ["start"] = event.start.dateTime;
//             item ["end"]   = event.end.dateTime;
//             eventsAvailabilities.push(item); 
//           });
//         } else {
//           console.log('No upcoming events found.');
//         }
//          console.log('7');
//          res.status(200).send(eventsAvailabilities);
//       }); // end calendar.events.list
  
//   // === read ===        
//              console.log('Final');
//             //res.status(200).send(eventsAvailabilities);
//             break;
   
//          // Object.keys(eventsAvailabilities).forEach(k => delete eventsAvailabilities[k]);
          
//         case 'updatesDatesValues':
//           console.log('updatesDatesValues');
//       //  ==== insert ===
//       calendar.events.insert({
//         auth: auth,
//         calendarId: '5shl6ad2n056oquag39idg64c0@group.calendar.google.com',
//         resource: event,
//       }, function(err, event) {
//         if (err) {
//           console.log('There was an error contacting the Calendar service: ' + err);
//           return;
//         }
//         console.log('Event created: %s', event.htmlLink);
//       });
  
//       //  ==== insert ===
//           res.status(200).send({updates: 'done'});
//           break;
          
//         default:
//           console.log('pas de correspondance');
//       }
   
//     })
//       // This just prints out all Worksheet names as an example
//       // .then(({ data: {calendar} }) => {
//       //   res.status(200).send({calendar});
//       // })
//       // .catch(err => {
//       //   res.status(500).send({ err });
//       // })
//   };
  
  

// // ==-===-=-=-=-=-=-=-=-=-= Free\Busy -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//   var startDate = new Date(),
//   endDate = new Date();

// var rootStart = startDate,
//   rootEnd = endDate;

// gcal(<accessToken>).freebusy.query({
//     "items":[{
//         "id": calObj.name
//     }],
//     "timeMin": startDate.toISOString(),
//     "timeMax": endDate.toISOString(),
//     "timeZone": "GMT+0100"
// },{
//     fields: "calendars,groups,kind,timeMax,timeMin", 
//     alt:"json"
// }, function(err, data) {
//     if(err) return console.log(err)

//     // then calculate free slots
//     return slotsFromEvents(startDate, data.calendars[<calName>].busy)
// })

// var interval = 2, // how big single slot should be (in this case 2 hrs) 
// freeSlots = []; 

// function slotsFromEvents(date,events) {
//   events.forEach(function (event, index) { //calculate free from busy times
//       if (index == 0 && startDate < event.start) {
//           freeSlots.push({startDate: startDate, endDate: event.start});
//       }
//       else if (index == 0) {
//           startDate = event.end;
//       }
//       else if (events[index - 1].end < event.start) {
//           freeSlots.push({startDate: events[index - 1].end, endDate: event.start});
//       }

//       if (events.length == (index + 1) && event.end < endDate) {
//           freeSlots.push({startDate: event.end, endDate: endDate});
//       }
//   });

//   if (events.length == 0) {
//       freeSlots.push({startDate: startDate, endDate: endDate});
//   }

//   var temp = {}, hourSlots = [];
//   freeSlots.forEach(function(free, index) {
//       var freeHours = new Date(free.endDate).getHours() - new Date(free.startDate).getHours(), freeStart = new Date(free.startDate), freeEnd = new Date(free.endDate);
//       while(freeStart.getHours()+freeHours+interval>=0) { // 11 + 4 + 2 >= 0
//           if(freeHours>=interval) {
//               temp.e = new Date(free.startDate);
//               temp.e.setHours(temp.e.getHours()+freeHours);
//               temp.s = new Date(free.startDate);
//               temp.s.setHours(temp.s.getHours()+freeHours-interval);
//               if(temp.s.getHours() >= rootStart.getHours() && temp.e.getHours() <= rootEnd.getHours()) {
//                   hourSlots.push({calName: calObj.name, startDate:temp.s, endDate:temp.e});
//                   temp = {};
//               }
//           }
//           freeHours--;
//       }
//   })
// };



