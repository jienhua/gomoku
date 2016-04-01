Template.navigation.events({
	'click .logout': function(event){
		event.preventDefault();
		var currentUser = Meteor.userId();
		Meteor.users.update({_id: currentUser}, {$set:{'profile.login': false}});
		Meteor.logout();
		Router.go('login');
	}
});

// Template.navigation.helpers({
// 	'rooms':function(){
// 		return Rooms.find({name:{$ne:'Lobby'}});
// 	}

// });