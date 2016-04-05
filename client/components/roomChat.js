Template.roomChat.helpers({
	'messages':function(){
		return Room.find({number:this.roomNumber}, {sort:{time:1}});
	}
});

Template.roomChat.events({
	'submit .input':function(event){
		event.preventDefault();
		var message = event.target.message.value;
		if(message !== ''){
			var userId = Meteor.userId();
			var user = Meteor.users.findOne(userId);
			var name = user.username;
			Meteor.call('submitRoomMessage', {
					name: name,
					message: message
				},
				this.roomNumber
			);
			event.target.message.value = '';
			message='';
		}
	}
});