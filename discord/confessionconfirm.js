module.exports = {
	help: `Approves a confessional.`,
	guildOnly: '773859244163465223',
	commandFunction: function (args, message, Bot) {
		if (message.channel.id !== '781114745713066034') {
			return message.channel.send('This cannot be used here.').then(msg => msg.delete({ timeout: 3000 }));
		}
		const channel = client.channels.cache.get('781124564381597766');
		const origindb = require('origindb'), cdb = origindb('data/KGPDB'), confs = cdb('confessions').object();
		const id = toID(args.join('')).replace(/[^0-9]/g, '');
		if (id > confs.amt) return message.channel.send(`The highest ID is ${confs.amt}...`);
		if (!confs.list[id]) return message.channel.send('Something went wrong!');
		const con = confs.list[id];
		if (con.rejected) return message.channel.send('This confession has already been rejected!');
		if (con.confirmed) return message.channel.send('This confession has already been confirmed!');
		channel.send(`\`\`\`\n#${id}\n\n` + con.content + '\n```');
		message.channel.send('Confession confirmed.');
		con.confirmed = true;
		con.confirmer = message.author.id;
		cdb.save();
		client.users.cache.get(con.author).send(`Your confession has been approved! (ID: ${id})`);
	}
};
