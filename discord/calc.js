module.exports = {
	help: `Does stuff.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		return message.channel.send("https://calc.pokemonshowdown.com/");
	}
};
