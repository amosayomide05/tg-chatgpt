const { Telegraf } = require('telegraf');
const request = require("request");
//Put your bot token below
const token = "";
const bot = new Telegraf(token);
const generateSpeech = require("./tts.js");
const fs = require("fs");
const axios = require("axios");
const { url } = require('inspector');
let options = { json: true };
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const { transcribeAudioFile } = require('openai-whisper');

bot.start((ctx) => {
    ctx.reply('Hello there!, This is a Chatgpt bot made by @amosayomide05');
});

bot.on('message', (ctx) => {
    if (ctx.message.text != "") {
        (async () => {
            ctx.replyWithChatAction('typing');
            var msg_old = ctx.message.text;
           // var url_link = await ctx.telegram.getFileLink(ctx.message.audio.file_id)
           // console.log(url_link.URL)

            var msg_from = ctx.message.from.id;
            var m_link = "https://api.amosayomide05.cf/gpt/?question=" + msg_old + "&string_id=" + msg_from;
      request(m_link, options, (error, res, body) => {

                if (!error && res.statusCode == 200) {
                    
                    
                    var response = body.response;

                        let responseStr = response.trim();
                    ctx.reply(responseStr);

                   
                    
                }
                else{
                    ctx.reply("Chatgpt is down on my server");
                }
            });



        })();
    }
});

bot.on('audio', async (ctx) => {
   

})

bot.on('voice', async (ctx) => {
    
                        
    const file_name = ctx.message.voice.file_unique_id;
    const { href } = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    var filenamee = "./audios/" + file_name + ".mp3";
    await downloadFile(href, filenamee);
    
    await transcribeAudioFile(filenamee)
    .then(transcription => {
      console.log(transcription);
    })
    .catch(error => {
      console.error(error);
    });

    ctx.reply("ok")

    var audioFile = "./audios/"+Math.floor(Math.random() * 99999) + ".mp3";
                       var SPEECH_KEY = "e1890c644d73497e9ef01a7813ac5b08";
                        var SPEECH_REGION = "eastus";
    
   // await generateSpeech(audioFile, SPEECH_KEY, SPEECH_REGION, "en-US-JennyNeural", "My name is ayo");
                      
      //                ctx.replyWithAudio({
      //                  source: fs.createReadStream(audioFile),
       //                 });
})

bot.launch();


process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----');
    console.log(error);
    console.log('----- Exception origin -----');
    console.log(origin);

})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----');
    console.log(promise);
    console.log('----- Reason -----');
    console.log(reason);
})


async function downloadFile(url, path) {
  try {
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    });
    response.data.pipe(fs.createWriteStream(path));
    console.log('Download complete!');
  } catch (error) {
    console.error('Download failed:', error);
  }
}
