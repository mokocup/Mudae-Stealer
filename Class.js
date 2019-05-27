//Adding Library , Class , Module , Package
const eris = require('eris');
const heart_react = ['❤', '💘', '♥', '💖', '💓', '💕', '💗'];
const fs = require('fs');
const file = {
    'Ranking': './database/ranking.json',
    'WaitRanking': './database/waitranking.json',
    'Wishlist':'./config/wishlist.json'
};

//Bot Classes
class Bot{
    constructor(token, isBot = true) {

        //Define Bot
        if (isBot) {

            //------------------------------------------------------------------------------------------------------------
            if (fs.existsSync(file['Ranking'])) {
                this.ranking = JSON.parse(fs.readFileSync(file['Ranking']));
            } else {
                console.log('Ranking File Not Found , New User');
                this.ranking = {};
            }
            //------------------------------------------------------------------------------------------------------------
            if (fs.existsSync(file['WaitRanking'])) {
                this.waitranking = JSON.parse(fs.readFileSync(file['WaitRanking']));
            } else {
                console.log('Waiting Ranking File Not Found , New User');
                this.waitranking = {};
            }
            //------------------------------------------------------------------------------------------------------------
            if (fs.existsSync(file['Wishlist'])) {
                this.wishlist = JSON.parse(fs.readFileSync(file['Wishlist']));
            } else {
                console.log('Wishlist File Not Found , New User');
                this.wishlist = {};
            }
            //------------------------------------------------------------------------------------------------------------
            this.bot = new eris.CommandClient(token);


            //Run when Bot active
            this.bot.on('ready', () => {
                console.log('Hello');
            });


            //Run when a message is created
            this.bot.on('messageCreate', (message) => {
                let msg = new Message(message);
                msg = null;
            });


            //Run when a reaction add to a Message
            this.test = this.bot.on("messageReactionAdd", (message, emoji, userid) => {
                //console.log(this.wishlist);
                let msg = new Message(message);
                if (msg.isMudae() && heart_react.includes(get(emoji, 'name'))) {
                    //Get Waifu Name
                    let waifu_name = msg.get_embeds_author();
                    if (this.ranking[waifu_name]) {
                        if((parseInt(this.ranking[waifu_name])<1000 || get(this.wishlist,'Wishlist').includes(waifu_name) && get(this.wishlist,'Channel').includes(msg.get_channel_id()) )){

                        }
                    } else {
                        this.waitranking[waifu_name] = 0;
                    }
                }
                msg = null;
            });


            this.bot.connect();
            //Define Bot End
        } else {

        }
    }
}



//Message Classes
class Message {
    constructor(msg) {
        this.msg = msg;
    }

    get(string) {
        return get(this.msg, string);
    }

    get_id() {
        return get(this.msg, 'id');
    }
    get_channel(string){
        return get(this.msg, 'channel.' + string);
    }
    get_channel_id(){
        return get(this.msg, 'channel.id');
    }
    get_author(string) {
        return get(this.msg, 'author.' + string);
    }

    get_author_id() {
        return get(this.msg, 'author.id');
    }

    get_author_username() {
        return get(this.msg, 'author.username');
    }

    get_content() {
        return get(this.msg, 'content');
    }

    get_embeds(string) {
        return get(this.msg, 'embeds.0.' + string);
    }

    get_embeds_author() {
        return get(this.msg, 'embeds.0.author.name');
    }

    get_embeds_des() {
        return get(this.msg, 'embeds.0.description')
    }

    isMudae() {
        const regex = /^(Mudamaid [0-9]*)$/gmi;
        //console.log(msg);
        //console.log(msg);
        const str = this.get_author_username();
        let m;
        let name;
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            name = m;
        }
        return !!name;
    }
}



//Globals Function
checknull = function (obj, key) {
    return key.split(".").reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};

get = function (data, key) {
    let x = checknull(data, key);
    if (x) {
        return x;
    } else {
        return 0;
    }
};

module.exports = Bot;