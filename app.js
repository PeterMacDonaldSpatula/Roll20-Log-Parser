const read = require('read-file');
const parser = require('./local_modules/fileparser/fileparser.js');
const htmlcreator = require('./local_modules/htmlcreator/htmlcreator.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var filename;
var title;

process.on('exit', (code) => {
  console.log('Finished!');
});

rl.question('What is the log filename? ', (answer) => {
  filename = answer;
  rl.question('What is the name of this campaign? ', (answer) => {
    read(filename, 'utf8', function(err, buffer) {
      if (err) {
        console.log(err);
      } else {
        var sessions = parser.getMessages(buffer);
        htmlcreator.createPages(sessions, answer);
      }
    });
    rl.close();
  });
});
