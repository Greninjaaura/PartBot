module.exports = {
	cooldown: 100000,
	help: `Displays the roomintro for the 1v1 OMs.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		// eslint-disable-next-line max-len
		Bot.say(room, `!htmlbox <center><img src="https://i.ibb.co/x5S1mDT/DRUD.png" usemap="#image-map" height="195" width="417"><map name="image-map"><area target="" alt="Introduction" title="Introduction" name="send" value="INTRO" coords="37,23,170,50" shape="rect"><area target="" alt="Tiers List" title="Tiers List" name="send" value="TIERS" coords="30,154,114,191" shape="rect"><area target="" alt="Smogon" title="Smogon" href="https://www.smogon.com/forums/threads/1v1-oms.3648454/" coords="127,154,249,190" shape="rect"><area target="" alt="Roomauth" title="Roomauth" name="send" value="ROOMAUTH" coords="264,155,390,189" shape="rect"></map></center>`);
	}
};
