const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

client.on('ready', () => {
    console.log('봇 활성화 완료!');
  });
 
  
client.on('message', (message) => {
    if(message.author.bot) return;
  
    if(message.content == '/짱구명령어') {
      if(checkPermission(message)) return
      return message.reply('```명령어 목록 \n /청소 \n !투표 \n```');
    }
    if(message.content.startsWith('/청소')) {
    if(checkPermission(message)) return

    var clearLine = message.content.slice('/청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @나긋해 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        const _limit = 10;
        let _cnt = 0;

        message.channel.fetchMessages({limit: _limit}).then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
    }
  }
});
client.on('message', (message) => {
    if(message.content.startsWith("!투표")) {
        if(checkPermission(message)) return
        let args = message.content.split(" ") // ["!투표", "항목1/항목2/항목3", "시간(초)"]
        let list = args[1].split("/") // ["항목1", "항목2", "항목3"]
        let emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
        let tempString = ""
        let temp = 0
        if(!args) message.reply("`!투표 [항목1/항목2/항목3] 시간(1초 이상)` 이 올바른 명령어 입니다.")
        if(!args[2] || args[2] < 1) message.reply("`!투표 [항목1/항목2/항목3] 시간(1초 이상)` 이 올바른 명령어 입니다.")
        if(list > 5) message.reply("항목은 최대 5개까지 가능합니다.")
        let embed = new Discord.MessageEmbed()
        embed.setTitle(`${message.member.displayName}님의 투표`)
            for(let i=0; i<list.length; i++) {
                temp += 1
                tempString += `**${temp}. ${list[i]}**\n`
            }
        embed.setDescription(tempString)
        embed.setFooter(`투표시간: ${args[2]}초`)
        console.log('전송')
        message.channel.send({ embed: embed }).then(msg => {
            for(let i=0; i<list.length; i++) {
                msg.react(emojis[i])
            }
            setTimeout(function() {
                msg.edit(`<@!${message.author.id}> 투표가 종료되었습니다.`, { embed: embed })
                console.log('종료')
            }, parseInt(args[2])*1000)
        })
    }
})
function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 1000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}

  
  
client.login(token);
