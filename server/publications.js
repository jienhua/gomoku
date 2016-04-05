Meteor.publish('lobbyMessages', function(){
	return LobbyMessages.find({},{sort:{time:-1}, limit:10});
});

Meteor.publish('boards', function(){
	return Boards.find();
});

Meteor.publish('games', function(){
	return Games.find();
});

Meteor.publish('rooms', function(roomNumber){
	if(roomNumber === 0){
		return Rooms.find({},{sort:{number:1}});
	}else{
		return Rooms.find({'number': roomNumber});
	}
});

Meteor.publish('users', function(){
	return Meteor.users.find();
});