const http = require('http');
const url = require('url');
const { parse } = require('querystring');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// const db = require('./db');

// const Notes = db.notes;

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
                .then(message => {
                    console.log(message);
                    if (message) res.end(JSON.stringify({ 'ok': true}))})
                .catch(err => {
                    console.log(err.response.body.ok);
                    res.end(JSON.stringify( err.response.body));
                })
            }
        });
    }

}).listen(process.env.PORT || "3500");