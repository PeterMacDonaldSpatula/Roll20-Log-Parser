const cheerio = require('cheerio');
const fs = require('fs-extra');

const SESSION_BREAK_THRESHOLD = 108000000;

var $;

var messages = [];

var moveAvatar = function(path) {
  var dirIndex = path.indexOf('/');
  var oldDir = path.substr(0, dirIndex);
  var newPath = path.replace(oldDir, 'img');
  fs.copy(path, 'output/' + newPath, {overwrite : false}, function(err) {
    if (err && err.errno != -4082) return console.error(err);
  });
  return newPath;
}

var parseSessions = function(messages) {
  var sessions = [];
  var currentSession = [messages[0]];
  var currentTimestamp = messages[0].timestamp;

  for (var i=1; i < messages.length; i++) {
    if (messages[i].timestamp - currentTimestamp > SESSION_BREAK_THRESHOLD) {
      sessions.push(currentSession);
      currentSession = [messages[i]];
      currentTimestamp = messages[i].timestamp;
    } else {
      currentSession.push(messages[i]);
      currentTimestamp = messages[i].timestamp;
    }
  }
  sessions.push(currentSession);
  //console.log(sessions[2]);
  console.log("Parsing complete");
  return sessions;
};

var getTime = function(timeString) {
  var output = {};
  var tokens = timeString.split(':');

  output.hours = parseInt(tokens[0]);
  if (timeString.indexOf('PM') >= 0) {
    output.hours += 12;
  }
  output.minutes = parseInt(tokens[1].replace('PM', '').replace('AM', ''));

  return output;
};

var getMonth = function(monthString) {
  var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  for (var i = 0; i < months.length; i++) {
    if (monthString.toLowerCase() == months[i]) {
      return i+1;
    }
  }
  return -1;
};

var getDate = function(dateString) {
  var tokens = dateString.split(' ');
  var hours;
  var minutes;
  var year;
  var month;
  var day;
  var output;

  if (tokens.length > 1) {
    month = getMonth(tokens[0]);
    day = parseInt(tokens[1]);
    year = parseInt(tokens[2]);
    let time = getTime(tokens[3]);
    hours = time.hours;
    minutes = time.minutes;
    output = new Date(year, month, day, hours, minutes);
    return output;
  } else if (tokens.length == 1) {
    let time = getTime(dateString);
    hours = time.hours;
    minutes = time.minutes;
    let currentDate = new Date();
    year = currentDate.getFullYear();
    month = currentDate.getMonth();
    day = currentDate.getDate();
    output = new Date(year, month, day, hours, minutes);
    return output;
  } else {
    return new Date();
  }
};

var getMessages = function(input) {

  var messageObj;
  console.log("Now parsing your file. Please be patient. This may take a while.");
  var result = input.replace(/(<img[^>]+)/g, "$1 /");
  $ = cheerio.load(result, {
    normalizeWhiteSpace : true,
    recognizeSelfClosing : true
  });

  fs.remove('/output', err=> {
    if (err) {

    } else {
      console.log("Clearing output directory.");
    }
  });

  $('.message').each(function(i, elem) {
    if ($(this).hasClass('desc')) {
      //console.log("DESC MESSAGE");
      if (!(messageObj === undefined)) {
        messages.push(messageObj);
      }

      messageObj = {};
      messageObj.desc = true;
      messageObj.emote = false;
      messageObj.lines = [];
    } else if ($(this).children('.avatar').length) {
      //console.log("NEW MESSAGE");

      if (!(messageObj === undefined)) {
        messages.push(messageObj);
      }

      messageObj = {};
      messageObj.emote = false;
      messageObj.desc = false;
      messageObj.lines = [];
    } else {
      //console.log("CONTINUING MESSAGE");
    }
    if ($(this).hasClass('emote')) {
      messageObj.emote = true;
    }

    if ($(this).children('.tstamp').length) {
      messageObj.timestamp = getDate($(this).children('.tstamp').text()).getTime();
      $(this).children('.tstamp').empty();
    }
    if ($(this).children('.avatar').length) {
      messageObj.avatar = $(this).children('.avatar').html().replace('<img src=\"', '').replace('\">', '');
      if (messageObj.avatar != '') {
        messageObj.avatar = moveAvatar(messageObj.avatar);
      }
    }
    if ($(this).children('.by').length) {
      messageObj.speaker = $(this).children('.by').text();
      $(this).children('.by').empty();
    }
    messageObj.lines.push($(this).text().replace(new RegExp('\r?\n','g'), '').trim());


    //console.log($(this).html());
    //console.log('split');
  });

  if (!(messageObj === undefined)) {
    messages.push(messageObj);
  }

  //console.log(messages);
  return parseSessions(messages);
};

exports.getMessages = getMessages;
