Template.lobby.helpers({
	'rooms':function(){
		return Rooms.find({name:{$ne:'Lobby'}});
	}

});