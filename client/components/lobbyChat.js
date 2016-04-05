Template.lobbyChat.helpers({
	'messages':function(){
		return LobbyMessages.find({},{sort:{time:1}});
	}
});

Template.lobbyChat.events({
	'submit .input':function(event){
		event.preventDefault();
		var message = event.target.message.value;
		if(message !== ''){
			var userId = Meteor.userId();
			var user = Meteor.users.findOne(userId);
			var name = user.username;
			var messages = LobbyMessages.find();
			console.log(messages.count());
			Meteor.call('submitLobbyMessage', {
				name: name,
				message: message
			});
			event.target.message.value = '';
			message='';
		}
	}
});