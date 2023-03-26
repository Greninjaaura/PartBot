module.exports = {
	help: `The Chess module. Use \`\`play (room) (position)-(position)\`\` to play.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = tools.getRoom(room);
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return Bot.commandHandler('chess', by, args, room, true);
	}
};
