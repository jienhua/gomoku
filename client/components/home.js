Template.home.helpers({
	'name':function(){
		return Meteor.user().username;
	}
});

Template.home.events({

	'click #game_lobby_btn':function(event){
		Router.go('lobby');
	}
});