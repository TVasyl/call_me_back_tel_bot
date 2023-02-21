const http = require('http');
const url = require('url');
const { parse } = require('querystring');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// const db = require('./db');

// const Notes = db.notes;
// const randomstring = require("randomstring");

const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true});

bot.on('message', msg => console.log(msg));


http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log(`server work on ${process.env.PORT || "3500"} prot`);
    
    if (req.method == 'GET') {
        res.end(`server work on ${process.env.PORT || "3500"} prot`);
    }
    else {
        // POST Method
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let {userName, userPhone} = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            
            if(userName && userPhone) {
                userName = userName.trim();
                
                console.log("User: " + userName);
                console.log("Phone: " + userPhone);

                const message = `Мене звати ${userName}, предзвоніть мені будь-ласка на мій номер: +38${userPhone}`;

                bot.sendMessage(process.env.CHAT_ID, message)
                // bot.sendMessage(123, message)
                .then(message => {
                    console.log(message);
                    if (message) res.end(JSON.stringify({ 'ok': true}))})
                .catch(err => {
                    console.log(err.response.body.ok);
                    res.end(JSON.stringify( err.response.body));
                })
            }

            // if (params.note) {
                // let note = params.note;
                // note = note.trim();
                // console.log(note);
                // Notes.create({
                //     url: randomstring.generate({
                //         length: 24,
                //         capitalization : 'lowercase'
                //     }),
                //     text: note,
                //     timestamp: Math.floor(Date.now() / 1000),
                // }).then(result => {
                //     res.end(JSON.stringify({ 'result': true, "url": result.url }));
                // }).catch(err => {
                //     console.log(err);
                //     res.end(JSON.stringify({ 'result': false, "error": err }));

                // });
            // }
            // else if (params.url) {
            //     let url = params.url;
            //     url = url.trim();
            //     console.log(url);
            //     Notes.findOne({
            //         where: {
            //             "url": url
            //         }
            //     })
            //         .then(result => {
            //             if (result) {
            //                 res.end(JSON.stringify({ 'result': true, "note": result.text }));
            //                 // Notes.destroy({where: {id: result.id}}); // if you want delete message!!!
            //             }
            //             else {
            //                 res.end(JSON.stringify({ 'result': false, "text": 'note not found' }));
            //             }
            //         })
            //         .catch(err => {
            //             console.log(err);
            //             res.end(JSON.stringify({ 'result': false, "error": err }));
            //         });
            // }
            
        });
    }

}).listen(process.env.PORT || "3500");