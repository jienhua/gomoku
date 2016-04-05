Template.lobby.helpers({
	'rooms':function(){
		return Rooms.find({name:{$ne:'Lobby'}});
	},
	'usersList':function(){
		// if($('#showOnlineCheck').is(':checked')){
		// 	console.log('true');
		// 	return Meteor.users.find({},{sort:{'profile.rankPoint':1}});
		// }else{
		// 	console.log('false');
		// 	return Meteor.users.find({},{sort:{'profile.rankPoint':-1}});
		// }
		//console.log('usersList '+ Meteor.users.find().count());
		return Meteor.users.find({},{sort:{'profile.rankPoint':-1}});

	}

});
