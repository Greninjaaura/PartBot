module.exports = {
	cooldown: 1000,
	help: `Displays your permissions level. Order: Admin > Coder > Alpha > Beta > Gamma > Pleb > Locked.`,
	permissions: 'locked',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (args[0]) return Bot.say(room, unxa);
		const rank = tools.rankLevel(by, room);
		let role;
		switch (rank) {
			case 1:
				role = 'Locked.';
				break;
			case 2:
				role = 'muted.';
				break;
			case 3:
				role = 'a regular ol\' Joe.';
				break;
			case 4:
				role = 'a Gamma.';
				break;
			case 5:
				role = 'a Beta.';
				break;
			case 6:
				role = 'an Alpha.';
				break;
			case 9:
				role = 'a Coder.';
				break;
			case 10:
				role = 'a Bot Administrator.';
				break;
			default:
				role = 'somehow screwing up the Bot code. Definitely not PartMan\'s fault.';
				break;
		}
		if (rank < 4) Bot.pm(by, 'You are ' + role);
		else Bot.say(room, 'You are ' + role);
	}
};
