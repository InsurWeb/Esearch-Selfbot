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
