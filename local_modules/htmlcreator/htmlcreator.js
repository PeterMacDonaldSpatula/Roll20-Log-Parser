const writefile = require('write-file');


var createHeader = function(title) {
  var output = "<!doctype html>\n<html lang=\"en\">\n<head>\n<title>\n" + title + "\n</title>\n<!-- Bootstrap CSS -->\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css\" integrity=\"sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb\" crossorigin=\"anonymous\">\n</head>\n";
  return output;
}

var createFooter = function(sessionNumber) {
  var output = "<div id=\"navigation\" class=\"container\">";
  if (sessionNumber > 1) {
    output+="<a href=\"";
    output+= sessionNumber-1;
    output +=".html\">Previous</a> | ";
  } else if (sessionNumber < 0) {
    var temp = sessionNumber * (-1);
    output +="<a href=\"";
    output +=temp-1;
    output +=".html\">Previous</a> | ";
  }

  output +="<a href=\"toc.html\">Contents</a>";

  if (sessionNumber > 0 ) {
    output +=" | <a href=\"";
    output +=sessionNumber+1;
    output +=".html\">Next</a>";
  }

  output +="<!-- Bootstrap JS. -->\n";
  output +="<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n";
  output +="<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js\" integrity=\"sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh\" crossorigin=\"anonymous\"></script>\n";
  output +="<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js\" integrity=\"sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ\" crossorigin=\"anonymous\"></script>\n";
  output +="</body>\n</html>";

  return output;
}

var createBody = function(session) {
  var output = "<body>\n<div class = \"container\">\n";
  for (var i=0; i < session.length; i++) {

    if (session[i].desc == true) {
      output +=createDescBody(session[i]);
    } else if (session[i].emote == true) {
      output +=createEmoteBody(session[i]);
    } else {
      output +=createTextBody(session[i]);
    }
  }
  output +="</div>\n";

  return output;
}

var createDescBody = function(message) {
  var output = "<div id=\"desc message\">\n<h3>\n";
  for (var i=0; i < message.lines.length; i++) {
    output +=message.lines[i];
    output +="<br />\n";
  }
  output +="</h3>\n</div>\n<br />\n";

  return output;
}

var createEmoteBody = function(message) {
  var output = "<div id=\"emote message\">\n<b>\n<i>\n";
  if (message.avatar != '') {
    output += "<img src=\"";
    output +=message.avatar;
    output +="\" width = 100px height = 100px />\n";
  }
  for (var i=0; i < message.lines.length; i++) {
    output +=message.lines[i];
    output +="<br />\n";
  }
  output +="</i>\n</b>\n</div>\n<br />\n";

  return output;
}

var createTextBody = function(message) {
  var output = "<div id=\"general message\">\n";

  if (message.avatar != '') {
    output += "<img src=\"";
    output +=message.avatar;
    output +="\" width = 100px height = 100px />\n";
  }

  output += "<b>";
  output += message.speaker;
  output += "</b> ";

  for (var i=0; i < message.lines.length; i++) {
    output +=message.lines[i];
    output +="<br />\n";
  }
  output +="</div>\n<br />\n";

  return output;
}

var createPage = function(session, sessionNumber, title, endMarker) {
  var output = createHeader(title);
  output +=createBody(session);
  if (endMarker) {
    output += createFooter(sessionNumber * (-1));
  } else {
    output +=createFooter(sessionNumber);
  }
  writefile('output/' + sessionNumber + '.html', output, function(err) {
    if (err) return console.log(err);
    console.log("Creating file " + sessionNumber + ".html...");
  });
}

var createPages = function(sessions, title) {
  var tableOfContents = "<!doctype html>\n<html lang=\"en\">\n<head>\n<title>\n" + title + "\n</title>\n<!-- Bootstrap CSS -->\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css\" integrity=\"sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb\" crossorigin=\"anonymous\">\n</head>\n";
  tableOfContents += "<body>\n<div class = \"container\">\n";
  for (var i=0; i < sessions.length; i++) {
    if (i < sessions.length -1) {
      createPage(sessions[i], i+1, title);
    } else {
      createPage(sessions[i], i+1, title, true);
    }
    tableOfContents += '<div><a href=\"' + (i+1) + '.html\">Session ' + (i+1) + '</a></div>';
  }
  tableOfContents +="<!-- Bootstrap JS. -->\n";
  tableOfContents +="<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n";
  tableOfContents +="<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js\" integrity=\"sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh\" crossorigin=\"anonymous\"></script>\n";
  tableOfContents +="<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js\" integrity=\"sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ\" crossorigin=\"anonymous\"></script>\n";
  tableOfContents +="</body>\n</html>";
  writefile('output/toc.html', tableOfContents, function(err) {
    if (err) return console.log(err);
    console.log("Creating table of contents...");
  });
}

exports.createPages = createPages;
