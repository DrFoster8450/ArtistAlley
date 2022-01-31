const Discord = require('discord.js');
const bot = new Discord.Client({ fetchAllMembers: true });
const Token = require('./token.json');
const fs = require('fs');
const moment = require ('moment');
const Config = require(`./config.json`);

bot.commands = new Discord.Collection();

function Random(x, y) {
     return Math.floor(Math.random() * (y - x)) + x;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Command loader
fs.readdir("./commands/", (err, files) =>{
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === `js`);
    if(jsfile.length <= 0){
        console.log("Could not find commands.");
        return;
    }
    
    jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
        bot.commands.set(props.help.name, props);
        console.log(`${f} loaded.`);
    });
});

bot.on(`ready`, async() =>{
    bot.user.setActivity(`the Alley`, {type: `WATCHING`});
});

//Listener Event
bot.on('message', message => {

        let sender = message.author;
        let msg = message.content.toUpperCase();
        let prefix = Config.prefix;
        let userId = sender.id
        let now = moment();
        //let displayedName = message.member.displayName

        let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'))
        var serverId = "914811618943189012"

        if (!serverData[serverId]) serverData[serverId] = {} 
        if (!serverData[serverId].commissionCount) serverData[serverId].commissionCount = 0

        fs.writeFileSync('Storage/serverData.json', JSON.stringify(serverData))

        let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'))

        if (!userData[userId]) userData[userId] = {} 
        if (!userData[userId].currentlyCommissioning) userData[userId].currentlyCommissioning = "False"
        if (!userData[userId].commissioningStage) userData[userId].commissioningStage = 0

        if (!userData[userId].commissionWho) userData[userId].commissionWho = "None"
        if (!userData[userId].commissionTitle) userData[userId].commissionTitle = "None"
        if (!userData[userId].commissionPrice) userData[userId].commissionPrice = "None"
        if (!userData[userId].commissionPayment) userData[userId].commissionPayment = "None"
        if (!userData[userId].commissionDescription) userData[userId].commissionDescription = "None"
        if (!userData[userId].commissionDeadline) userData[userId].commissionDeadline = "None"
        if (!userData[userId].commissionOther) userData[userId].commissionOther = "None"

        let commissionData = JSON.parse(fs.readFileSync('Storage/commissionData.json', 'utf8'))

        if(message.guild === null){//Bots DMS

            console.log("Is dms")

            if(userData[userId].currentlyCommissioning == "True"){
                if(userData[userId].commissioningStage == 0){
                    userData[userId].commissioningStage = 1

                }

                if(userData[userId].commissioningStage == 1){
                    //Title
                    var comTitle = message.content
                    if(comTitle.length > 40){return message.channel.send("The Title cannot have more than 40 characters.")}
                    userData[userId].commissionTitle = comTitle
                    userData[userId].commissioningStage = 2

                    message.channel.send("Please reply to this message with the amount you're willing to pay, preferrably in USD. This price is negotiable.")
                }else if(userData[userId].commissioningStage == 2){
                    //Title
                    var comPrice = message.content
                    if(comPrice.length > 25){return message.channel.send("The price cannot have more than 25 characters.")}
                    userData[userId].commissionPrice = comPrice
                    userData[userId].commissioningStage = 3

                    message.channel.send("Please reply to this message with the method of payment you wish to use.")
                }else if(userData[userId].commissioningStage == 3){
                    //Title
                    var comPayment = message.content
                    if(comPayment.length > 25){return message.channel.send("The price cannot have more than 25 characters.")}
                    userData[userId].commissionPayment = comPayment
                    userData[userId].commissioningStage = 4

                    message.channel.send("Please reply to this message with a description of the piece being commissioned. The more info the better.")
                }else if(userData[userId].commissioningStage == 4){
                    //Title
                    var comDescription = message.content
                    if(comDescription.length > 750){return message.channel.send("The description cannot have more than 750 characters.")}
                    userData[userId].commissionDescription = comDescription
                    userData[userId].commissioningStage = 5

                    message.channel.send("Please reply to this message with the deadline for the commission piece, please be sure to include a timezone where appropriate.")
                }else if(userData[userId].commissioningStage == 5){
                    //Title
                    var comDeadline = message.content
                    if(comDeadline.length > 30){return message.channel.send("The deadline cannot have more than 30 characters.")}
                    userData[userId].commissionDeadline = comDeadline
                    userData[userId].commissioningStage = 6

                    message.channel.send("Please reply to this message with any additional information that may come in handy for the commission.")
                }else if(userData[userId].commissioningStage == 6){
                    //Title
                    var comOther = message.content
                    if(comOther.length > 500){return message.channel.send("The other information cannot have more than 500 characters.")}
                    userData[userId].commissionOther = comOther

                    userData[userId].commissioningStage = 0
                    userData[userId].currentlyCommissioning = "False"

                    var colourRandom = Random(1,9)
                    if(colourRandom == 1){var embedColour = 1752220} //aqua
                    if(colourRandom == 2){var embedColour = 3447003} //blue
                    if(colourRandom == 3){var embedColour = 3066993} //green
                    if(colourRandom == 4){var embedColour = 10181046} //purple
                    if(colourRandom == 5){var embedColour = 15277667} //vivid pink
                    if(colourRandom == 6){var embedColour = 15844367} //gold
                    if(colourRandom == 7){var embedColour = 15158332} //red
                    if(colourRandom == 8){var embedColour = 15105570} //orange

                    let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'))
                    var serverId = "914811618943189012"

                    let commissionData = JSON.parse(fs.readFileSync('Storage/commissionData.json', 'utf8'))

                    var commissionId = serverData[serverId].commissionCount + 1
                    serverData[serverId].commissionCount = serverData[serverId].commissionCount + 1

                    if (!commissionData[commissionId]) commissionData[commissionId] = {} 
                    if (!commissionData[commissionId].comId) commissionData[commissionId].comId = commissionId
                    if (!commissionData[commissionId].comUserId) commissionData[commissionId].comUserId = sender.id

                    if (!commissionData[commissionId].comArtistId) commissionData[commissionId].comArtistId = userData[userId].commissionWho

                    if (!commissionData[commissionId].comTitle) commissionData[commissionId].comTitle = userData[userId].commissionTitle
                    if (!commissionData[commissionId].comDeadline) commissionData[commissionId].comDeadline = userData[userId].commissionDeadline
                    if (!commissionData[commissionId].comDescription) commissionData[commissionId].comDescription = userData[userId].commissionDescription
                    if (!commissionData[commissionId].comPrice) commissionData[commissionId].comPrice = userData[userId].commissionPrice
                    if (!commissionData[commissionId].comPayment) commissionData[commissionId].comPayment = userData[userId].commissionPayment
                    if (!commissionData[commissionId].comOther) commissionData[commissionId].comOther = userData[userId].commissionOther

                    if (!commissionData[commissionId].comState) commissionData[commissionId].comState = "Requested " + now.format('MMMM Do YYYY, h:mm:ss a'); 

                    message.channel.send("Commission form complete.\nCommission ID: **" + commissionId + "**")

                    fs.writeFileSync('Storage/serverData.json', JSON.stringify(serverData))
                    fs.writeFileSync('Storage/commissionData.json', JSON.stringify(commissionData))

                    var dmId = userData[userId].commissionWho
                    bot.users.fetch(dmId, false).then((user) => {
                        user.send("Commission Incoming!", {embed:{
                        title:"Commission Request!",
                        description: "<@!" + sender.id + "> has made a request for some of your work!\nCommission ID: **" + commissionId + "**",
                        color: embedColour,
                        fields: [{
                            name: "Title:",
                            value: userData[userId].commissionTitle,
                            inline: true
                        },{
                            name: "Deadline:",
                            value: userData[userId].commissionDeadline,
                            inline: true
                        },{
                            name: "Description:",
                            value: userData[userId].commissionDescription,
                            inline: false
                        },{
                            name: "Willing to Pay:",
                            value: userData[userId].commissionPrice,
                            inline: true
                        },{
                            name: "Payment Method:",
                            value: userData[userId].commissionPayment,
                            inline: true
                        },{
                            name: "Other information:",
                            value: userData[userId].commissionOther,
                            inline: false
                        }
                        ]}})
                    });
                    bot.users.fetch(dmId, false).then((user) => {
                        user.send("To accept or decline this request please use the '>request' command.\nThis command works by doing the following: '>request (commission id) (accept / decline / info)'")
                    })
                }
            }

            if(msg.startsWith(prefix + 'REQUEST')){

                var re = /(.+?)\s+(\d+)\s+(.+)/
                var match = re.exec(message.content);
                if(!match){return console.log("Request Regex Failed")}

                var commandName = (match[1])
                var requestId = (match[2])
                var requestState = (match[3])

                if(requestState.toUpperCase() == "ACCEPT"){

                    var requestSenderId = commissionData[requestId].comUserId

                    if(sender.id == userData[requestSenderId].commissionWho){
                        commissionData[requestId].comState = "Accepted " + now.format('MMMM Do YYYY, h:mm:ss a'); 
                        fs.writeFileSync('Storage/commissionData.json', JSON.stringify(commissionData))

                        var dmId = requestSenderId
                        bot.users.fetch(dmId, false).then((user) => {
                            user.send("Your request for <@!" + sender.id + ">, ID code **" + requestId + "** has been accepted.");
                        });

                        message.channel.send("Request ID **" + requestId + "** has been accepted")

                    }else{return message.channel.send("This request was not sent to you.")}
                }else if(requestState.toUpperCase() == "DECLINE"){

                    var requestSenderId = commissionData[requestId].comUserId

                    if(sender.id == userData[requestSenderId].commissionWho){
                        commissionData[requestId].comState = "Declined " + now.format('MMMM Do YYYY, h:mm:ss a'); 
                        fs.writeFileSync('Storage/commissionData.json', JSON.stringify(commissionData))

                        var dmId = requestSenderId
                        bot.users.fetch(dmId, false).then((user) => {
                            user.send("Your request for <@!" + sender.id + ">, ID code **" + requestId + "** has been declined. Sorry.");
                        });

                        message.channel.send("Request ID **" + requestId + "** has been declined")

                    }else{return message.channel.send("This request was not sent to you.")}
                }else if(requestState.toUpperCase() == "CANCEL"){

                    var requestSenderId = commissionData[requestId].comUserId

                    if(sender.id == userData[requestSenderId].commissionWho){
                        commissionData[requestId].comState = "Cancelled " + now.format('MMMM Do YYYY, h:mm:ss a'); 
                        fs.writeFileSync('Storage/commissionData.json', JSON.stringify(commissionData))

                        var dmId = requestSenderId
                        bot.users.fetch(dmId, false).then((user) => {
                            user.send("Your request for <@!" + sender.id + ">, ID code **" + requestId + "** has been cancelled. Sorry.");
                        });

                        message.channel.send("Request ID **" + requestId + "** has been cancelled")

                    }else{return message.channel.send("This request was not sent to you.")}
                }else if(requestState.toUpperCase() == "COMPLETED"){

                    var requestSenderId = commissionData[requestId].comUserId

                    if(sender.id == userData[requestSenderId].commissionWho){
                        commissionData[requestId].comState = "Completed " + now.format('MMMM Do YYYY, h:mm:ss a'); 
                        fs.writeFileSync('Storage/commissionData.json', JSON.stringify(commissionData))

                        var dmId = requestSenderId
                        bot.users.fetch(dmId, false).then((user) => {
                            user.send("Your request for <@!" + sender.id + ">, ID code **" + requestId + "** has been completed. Sorry.");
                        });

                        message.channel.send("Request ID **" + requestId + "** has been completed")

                    }else{return message.channel.send("This request was not sent to you.")}
                }else if(requestState.toUpperCase() == "INFO"){
                    console.log("Info")
                    var commissionId = requestId
                    message.channel.send("Commission Information!", {embed:{
                        title:"Commission Request!",
                        description: "<@!" + commissionData[commissionId].comUserId + "> has made a request for some of <@!" + commissionData[commissionId].comArtistId + ">'s work!\nCommission ID: **" + commissionId + "**",
                        color: 15277667,
                        fields: [{
                            name: "Title:",
                            value: commissionData[commissionId].comTitle,
                            inline: true
                        },{
                            name: "Deadline:",
                            value: commissionData[commissionId].comDeadline,
                            inline: true
                        },{
                            name: "Description:",
                            value: commissionData[commissionId].comDescription,
                            inline: false
                        },{
                            name: "Willing to Pay:",
                            value: commissionData[commissionId].comPrice,
                            inline: true
                        },{
                            name: "Payment Method:",
                            value: commissionData[commissionId].comPayment,
                            inline: true
                        },{
                            name: "Other information:",
                            value: commissionData[commissionId].comOther,
                            inline: false
                        },{
                            name: "Request State::",
                            value: commissionData[requestId].comState,
                            inline: false
                        }
                        ]}})
                }else{
                    return message.channel.send("'>request (id) (Accept / Decline / Cancel / Completed / Info)'")
                }

            }

        }else{ //In server messages

            console.log("is server")

            //Reboot System
            if(msg === prefix + 'REBOOT'){
               if(message.author.id == 320298037274607616){
                message.channel.send("Restarting, give me a second.")
                process.exit(1);
               }
            }

            if(msg === prefix + 'ARTIST'){

                if(message.member.roles.cache.find(r => r.name === "Artist")){
                    //something here
                }else{
                    let role = message.member.guild.roles.cache.find(role => role.name === "Artist");
                    if (role){message.guild.members.cache.get(message.author.id).roles.add(role)}else{console.log("Not A Role")}
                }

                let displayedName = message.member.displayName
                var categoryName = displayedName + "'s Art Stand"
                // GuildChannelManager#create returns the channel you created
                message.guild.channels.create(categoryName, {
                    type: 'category',
                    permissionOverwrites: [
                        {id: message.guild.id, allow: ['VIEW_CHANNEL']},
                        {id: message.author.id, allow: ['VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']},

                    ]
                }).then(parent => {
                    const everyoneRole = message.guild.roles.cache.find(role => role.name === "@everyone");

                    // Create the Display Room
                    var displayBoardName = displayedName + "'s Display"
                    message.guild.channels.create(displayBoardName, {
                        type: 'text',
                        parent, // shorthand for parent: parent
                        permissionOverwrites: [
                            {id: message.author.id, allow: ['VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']},
                            {id: message.guild.id, deny: ['SEND_MESSAGES']},
                        ]
                    }).catch(console.error)

                    // Create the Community Room
                    var displayBoardName = displayedName + "'s Chatroom"
                    message.guild.channels.create(displayBoardName, {
                        type: 'text',
                        // under the parent category
                        parent, // shorthand for parent: parent
                        permissionOverwrites: [
                            {id: message.author.id, allow: ['VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']},
                            {id: message.author.id, allow: ['VIEW_CHANNEL']},
                        ]
                    }).catch(console.error)

                    // Same with the voice channel
                    var vcName = displayedName + "'s Streams"
                    message.guild.channels.create(vcName, {
                        type: 'voice',
                        parent,
                        permissionOverwrites: [
                            {id: message.guild.id, allow: ['VIEW_CHANNEL']},
                            {id: message.author.id, allow: ['VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']},
                        ]
                    }).catch(console.error)
                })

            }

            if(msg.startsWith(prefix + 'COMMISSION')){
                if(message.channel.id == "934181702048305193"){
                    if(userData[userId].currentlyCommissioning == "True"){return message.channel.send("You are already in the commissioning stage.")}
                    let mention = message.mentions.users.first();

                    if (!mention) return message.channel.send('You need to mention a user.');

                    userData[userId].commissionWho = mention.id

                    userData[userId].currentlyCommissioning = "True"

                    var dmId = sender.id
                    bot.users.fetch(dmId, false).then((user) => {
                        user.send("__**Commission Form Opened:**__\nPlease reply to this message with a short title to the piece being commissioned.");
                    });

                    message.delete({ timeout: 1000 })

                    fs.writeFileSync('Storage/userData.json', JSON.stringify(userData))
                }else{
                    return message.channel.send("Please make sure all >Commission commands are run in <#934181702048305193>")
                }

            }//END OF COMMISSION

        }//end of server messages

        fs.writeFileSync('Storage/userData.json', JSON.stringify(userData))
        //fs.writeFileSync('Storage/serverData.json', JSON.stringify(serverData))
        //fs.writeFileSync('Storage/commissionData.json', JSON.stringify(commissionData))

})

bot.on(`message`, async message =>{

//if(message.author.bot) return;
if(message.channel.type --- `dm`) return;
let prefix = Config.prefix;
let msgArray = message.content.split(` `);
let cmd = msgArray[0];
if(cmd.slice(0, prefix.length) !== prefix) return;
let args = msgArray.slice(1);
let cmdFile = bot.commands.get(cmd.slice(prefix.length).toLowerCase())
if(cmdFile) cmdFile.run(bot, message, args);
});

// this code runs when the bot turns on
bot.on('ready', () => {
    console.log('Artist Alley: Open for business!')
})

bot.login(Token.token);