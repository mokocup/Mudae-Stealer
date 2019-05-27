//Adding Library , Class , Module , Package
const botclass = require('./Class.js');
const config = require('./config.json');

//Define Global Variable
let botlist;


//Checking some requirement file exist or not

botlist = new botclass(config['BotToken']);