//Adding Library , Class , Module , Package
const eris = require('eris');
const heart_react = ['❤', '💘', '♥', '💖', '💓', '💕', '💗'];
const fs = require('fs');
const file = {
    'Ranking': './database/ranking.json',
    'Wishlist': './config/wishlist.json'
};

//Bot Classes
class Bot {
    constructor(token, isBot = true) {

        //Define Bot
        if (isBot) {
            this.botmode = isBot;
            //------------------------------------------------------------------------------------------------------------
            if (fs.existsSync(file['Ranking'])) {
                this.ranking = JSON.parse(fs.readFileSync(file['Ranking']));
            } else {
                console.log('Ranking File Not Found , New User');
                this.ranking = {};
            }
            //------------------------------------------------------------------------------------------------------------
            if (fs.existsSync(file['Wishlist'])) {
                this.wishlist = JSON.parse(fs.readFileSync(file['Wishlist']));
            } else {
                console.log('Wishlist File Not Found , New User');
                this.wishlist = {};
            }
            //------------------------------------------------------------------------------------------------------------
            this.bot = new eris.CommandClient(token,{},{
                "prefix": "do!"
            });


            //Run when Bot active
            this.bot.on('ready', () => {
                console.log('Hello');
            });

            //Register Command Here
            this.bot.registerCommand('imnext', (message, args) => {
                let msg = new Message(message);
                let nextim;
                for (let waifu_name_loop in this.ranking) {
                    if(!this.ranking.hasOwnProperty(waifu_name_loop)){
                        continue;
                    }
                    console.log('is run');
                    if (this.ranking[waifu_name_loop].Claims === -1) {
                        nextim = waifu_name_loop;
                        return;
                    }
                }
                if(nextim){
                    createMessage(msg.get_channel_id(), '$im ' + nextim);
                }
                msg = null;
            }, {
                //Options here
            });


            //Run when a message is created
            this.bot.on('messageCreate', (message) => {
                let msg = new Message(message);
                if (msg.isMudae() && msg.get_embeds_des() && msg.get_embeds_author()) {
                    this.mrankingtimer(msg);
                }
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
                        if ((get(this.ranking[waifu_name], 'Claims') < 1000 || get(this.wishlist, 'Wishlist').includes(waifu_name) && get(this.wishlist, 'Channel').includes(msg.get_channel_id()))) {

                        }
                    } else {
                        this.ranking[waifu_name] = {
                            "Ranked": -1,
                            "Likes": -1
                        };
                    }
                }
                msg = null;
            });


            this.bot.connect();
            //Define Bot End
        } else {

        }
    }

    async mrankingtimer(msg) {
        const timeout = ms => new Promise(res => setTimeout(res, ms));
        let waifu_name = msg.get_embeds_author();
        if (this.ranking[waifu_name]) {
            let array = gettextperline(msg.get_embeds_des());
            fs.writeFileSync('Message/msg'+Date.now()+'.json',JSON.stringify(msg,null,4));
            //if Array > 0 Check For Sure Since It Can Caught Exception
            if (array.length > 0) {
                //Set Gender
                const gender = ['<:male:452470164529872899>', '<:female:452463537508450304>'];
                let waifugender;
                if (array[0].search(gender[0]) !== -1 && array[0].search(gender[1]) !== -1) {
                    //Both Gender
                    waifugender = 2;
                } else if (array[0].search(gender[0]) !== -1) {
                    //Male
                    waifugender = 1
                } else {
                    //Female
                    waifugender = 0
                }
                this.ranking[waifu_name]['Gender'] = waifugender;

                // Set Series
                // Remove Gender Text
                array[0] = array[0].replace(gender[0], '');
                array[0] = array[0].replace(gender[1], '');
                // Remove Space
                array[0] = array[0].substring(0, array[0].length - 1);
                let seriesname = array[0];
                // Put Series to Data
                this.ranking[waifu_name]['Series'] = seriesname;
                //Ranking and Claims
                array[2]=array[2].replace('Claims: #','');
                array[3]=array[3].replace('Likes: #','');
                this.ranking[waifu_name]['Claims']=parseInt(array[2]);
                this.ranking[waifu_name]['Likes']=parseInt(array[3]);
                //Check if Any Girl is not take data yet
                let nextim;
                for (let waifu_name_loop in this.ranking) {
                    if(!this.ranking.hasOwnProperty(waifu_name_loop)){
                        continue;
                    }
                    if (this.ranking[waifu_name_loop].Claims === -1) {
                        nextim = waifu_name_loop;
                        return;
                    }
                }
                if(nextim){
                    await timeout(500);
                    createMessage(msg.get_channel_id(), '$im ' + nextim);
                }
            }
        }

    }

    saveData() {
        let jsondata = JSON.stringify(this.ranking, null, 4);
        fs.writeFileSync(file['Ranking'], jsondata);
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

    get_channel(string) {
        return get(this.msg, 'channel.' + string);
    }

    get_channel_id() {
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
        const str = this.get_author_username();
        if (str) {
            let x = str.search('Mudamaid');
            return x !== -1;
        }
        return false;
        // const regex = /^(Mudamaid [0-9]*)$/gmi;
        // //console.log(msg);
        // //console.log(msg);
        // const str = this.get_author_username();
        // let m;
        // let name;
        // while ((m = regex.exec(str)) !== null) {
        //     if (m.index === regex.lastIndex) {
        //         regex.lastIndex++;
        //     }
        //     name = m;
        // }
        // return !!name;
    }
}

//Globals Function

gettextperline = function (text) {
    let array = [];
    let newline = '\n';
    text = text + newline;
    let position = text.indexOf(newline);
    let startpos = 0;
    while (position !== -1) {
        array.push(text.substring(startpos, position));
        startpos = position + 1;
        position = text.indexOf(newline, position + 1);
    }
    return array;
};

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