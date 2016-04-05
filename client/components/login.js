Template.login.onRendered(function(){
	var validator = $('.login').validate({
		submitHandler:function(event){
			var username = $('[name=username]').val();
			var password = $('[name=password]').val();
			Meteor.loginWithPassword(username, password, function(error){
				if(error){
					if(error.reason == 'User not found'){
						validator.showErrors({
							username: error.reason
						});
					}
					if(error.reason == 'Incorrect password'){
						validator.showErrors({
							password: error.reason
						});
					}
				}else{
					var currentRoute = Router.current().route.getName();
					if(currentRoute == 'login'){
						Router.go('lobby');
					}
				}
			});
		}
	});
});

Template.login.events({
	'submit form': function(event){
		event.preventDefault();
	}
});