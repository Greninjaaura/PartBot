module.exports = {
	help: `Picks`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const a = args.join(' ').split(/, ?/g);
		Bot.pm(by, `${a[0] ? '[[]][[]]' + a.random() : '/me chooses nothing'}`);
	}
};
