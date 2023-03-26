module.exports = {
	help: `The Othello module. You'll need a chatroom for this.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = tools.getRoom(room);
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return Bot.commandHandler('othello', by, args, room, true);
	}
};
