const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

client.on('ready', () => {
    console.log('봇 활성화 완료!');
  });
 
client.on("message", (message) => {
    if (message.author.bot) return
  if (message.content.startsWith("/청소")) { 
    var clearLine = message.content.slice("/청소 ".length)
    var isNum = !isNaN(clearLine)

    if (isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return
    } else if (!isNum) {
      // c @나긋해 3
      if (message.content.split("<@").length == 2) {
        if (isNaN(message.content.split(" ")[2])) return

        var user = message.content.split(" ")[1].split("<@!")[1].split(">")[0]
        var count = parseInt(message.content.split(" ")[2]) + 1
        let _cnt = 0

        message.channel.messages.fetch().then((collected) => {
          collected.every((msg) => {
            if (msg.author.id == user) {
              msg.delete()
              ++_cnt
            }
            return !(_cnt == count)
          })
        })
      }
    } else {
      message.channel
        .bulkDelete(parseInt(clearLine) + 1)
        .then(() => {
          message.channel.send(`<@${message.author.id}> ${parseInt(clearLine)} 개의 메시지를 삭제했습니다. (이 메시지는 잠시 후 사라집니다.)`).then((msg) => msg.delete({ timeout: 6000 }))
        })
        .catch(console.error)
    }
  }});
  client.on("messageDelete", (messageDelete) => {
    const channel = messageDelete.guild.channels.find(ch => ch.name === '삭제기록');
    channel.send(`${messageDelete.author}` + "님이" + '**```' + `${messageDelete.content}` + "```**메세지를 삭제하셨습니다. \n유저 아이디 : " + `${messageDelete.author.id}`);
  });     
client.login(token);
