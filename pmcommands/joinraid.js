module.exports = {
	noDisplay: true,
	help: `Join a PoGo raid!`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const room = 'pokemongo';
		if (!Bot.rooms[room]) return Bot.pm(by, `Uhh I'm not in Pokemon Go`);
		const user = toID(by);
		if (!Bot.rooms[room].users.find(u => toID(u) === user)) return Bot.pm(by, `<<pokemongo>>`);
		const raids = Bot.rooms[room].raids || {};
		if (!Object.keys(raids).length) return Bot.roomReply(room, by, "No raids are active, whoops");
		const host = toID(args.join(''));
		if (host === user) return Bot.roomReply(room, by, `Uhh of course you're included in your own raid`);
		let userDB;
		if (!(userDB = DB.get(user))) return Bot.roomReply(room, by, 'You need to register first!');
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `B-but who's hosting?`);
		const raid = raids[host];
		if (raid.players[user]) return Bot.roomReply(room, by, `B-but you're already in D:`);
		if (raid.locked) return Bot.roomReply(room, by, `The raid is locked - you may no longer join or leave.`);
		if (Object.keys(raid.players).length >= raid.slots) return Bot.roomReply(room, by, `The raid is full!`);
		raid.players[user] = userDB.displayName;
		raid.HTML();
		Bot.say(room, `${by.substr(1)} joined ${raid.hostName}'s raid!`);
		// eslint-disable-next-line max-len
		Bot.say(room, `/sendprivatehtmlbox ${by}, <div class="broadcast-green" style="font-weight:bold">The host's FC is ${raid.code.slice(0, 4)}<span style="padding:5px;">${raid.code.slice(4, 8)}</span>${raid.code.slice(8, 12)}.</div>`);
	}
};
