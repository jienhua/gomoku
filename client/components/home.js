Template.home.helpers({
	'name':function(){
		return Meteor.user().username;
	}
});