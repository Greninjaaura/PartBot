module.exports = {
	cooldown: 10000,
	help: `Pings on Discord.`,
	permissions: 'alpha',
	commandFunction: function (Bot, room, time, by, args, client) {
		return Bot.pm(by, 'This command is under a constrictor! To avoid being swallowed by a snake, please append a ``7`` to the command and try again.');
		if (args[0] && typelist.includes(toID(args[0]))) {
			client.channels.get('549432010322477056').send('Type: ' + tools.toName(toID(args[0])) + ' Tour started!');
			Bot.say(room, 'Sent.');
			const tourArr = JSON.parse(fs.readFileSync('./data/DATA/tourrecords.json', 'utf8'));
			tourArr.push({ official: false, type: toID(args[0]), starter: toID(by), time: Date.now() });
			fs.writeFileSync('./data/DATA/tourrecords.json', JSON.stringify(tourArr));
		} else Bot.say(room, 'Type not found.');
	}
};
