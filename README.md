# Roll20-Log-Parser v0.0.1

A Node.js application which converts a Roll20 Chatlog into a more readable format.

## Installation
In order to use this app, you need to have [Node.js](https://nodejs.org) installed, along with the Node Package Manager (which is included in the Node.js installer). I've tested it with version 8.9.4 (the most recent stable version at the time of writing).

Download the repository as a zip file, and then extract it to a directory of your choice. Open a command prompt window and navigate it to the directory in question. Then run the command:

`npm install`

After the installer runs, you're ready to use the app.

## Execution
Open your Roll20 log, and then in your web browser click **File > Save Page As...** and save it to the directory containing the app.js file.

Then open a commnd prompt window (cmd), navigate it to that directory, and execute the following command:

`node app.js`

You will then be prompted to provide the name of the html file and the name of the campaign. Once you do, the app will run. 

When it finishes, your files will be found in the 'output' directory.

## Known Issues

Dice rolls are represented as just plain-text numbers, without indicating the math behind them, or having any special formatting. This will be solved, but I'll have to redo some of my parsing code to figure it out.

The resulting HTML documents, although servicable, are kind of plain and shitty-looking.

If the same person says the last lines of a session, and also the first lines of the next session, all of their lines will be put at the end of the first session. This cannot be solved unless Roll20 changes how their logs are represented.
