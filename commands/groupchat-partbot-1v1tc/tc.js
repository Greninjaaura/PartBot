module.exports = {
	cooldown: 1000,
	help: `Starts a Tournament with the given options. Syntax: ${prefix}tc (random/type) (e[n]/rr/drr) (official)`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		let type = toID(args.shift());
		if (type === 'random' || type === 'r') type = typelist[Math.floor(Math.random() * 18)];
		if (!typelist.includes(type)) return Bot.say(room, 'Invalid Type.');
		if (args[0]) args[0] = toID(args[0]);
		let tourStr;
		switch (args[0]) {
			case undefined: case 'drr':
				if (args[0]) args.shift();
				tourStr = '/tour create Gen8-1v1, rr, , 2';
				break;
			case 'rr':
				args.shift();
				tourStr = '/tour create Gen8-1v1, rr';
				break;
			case 'o': case 'official':
				tourStr = '/tour create Gen8-1v1, rr, , 2';
				break;
			default:
				const ttype = args.shift();
				if (ttype.startsWith('e')) {
					switch (parseInt(ttype.substr(1))) {
						case NaN: case 1:
							tourStr = '/tour create Gen8-1v1, elim';
							break;
						default:
							tourStr = '/tour create Gen8-1v1, elim, , ' + parseInt(ttype.substr(1));
							break;
					}
				} else return Bot.say(room, 'Invalid Tour Type.');
				break;
		}
		const staggerSay = function (stuff) {
			Bot.say(room, stuff);
		};
		if (args[0] && ['o', 'official'].includes(toID(args[0]))) {
			tourStr = '/tour create Gen8-1v1, rr';
			Bot.say(room, tourStr);
			Bot.say(room, '$settype ' + type);
			setTimeout(staggerSay, 1000, '$official');
			const tourArr = JSON.parse(fs.readFileSync('./data/DATA/tourrecords.json', 'utf8'));
			tourArr.push({ official: true, type: type, starter: toID(by), time: Date.now() });
			fs.writeFileSync('./data/DATA/tourrecords.json', JSON.stringify(tourArr));
			const reqTour = require('../../data/TOURS/CODES/TC/' + type + '.js');
			if (!reqTour[type]) return Bot.say(room, 'PartMan messed something up.');
			Bot.say(room, reqTour[type]);
			return client.channels.cache.get('549432010322477056').send('<@&616345204533755920> Type: ' + type.charAt(0).toUpperCase() + type.substr(1) + ' Tour started!');
		}
		const reqTour = require('../../data/TOURS/CODES/TC/' + type + '.js');
		if (!reqTour[type]) return Bot.say(room, 'PartMan messed something up.');
		client.channels.cache.get('549432010322477056').send('Type: ' + type.charAt(0).toUpperCase() + type.substr(1) + ' Tour started!');
		const tourArr = JSON.parse(fs.readFileSync('./data/DATA/tourrecords.json', 'utf8'));
		tourArr.push({ official: false, type: type, starter: toID(by), time: Date.now() });
		fs.writeFileSync('./data/DATA/tourrecords.json', JSON.stringify(tourArr));
		Bot.say(room, tourStr);
		Bot.say(room, '$settype ' + type);
		Bot.say(room, reqTour[type]);
	}
};
