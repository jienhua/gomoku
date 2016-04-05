Template.register.onRendered(function(){
	var validator = $('.register').validate({
		submitHandler: function(event){
			var username = $('[name=username]').val();
			var password = $('[name=password]').val();
			Accounts.createUser({
				username: username,
				password: password,
				profile:{
					rankPoint: 10,
					title: 'NewBie'
				}
			},function(error){
				if(error){
					if(error.reason == 'Username already exists.'){
						validator.showErrors({
							username: error.reason
						});
					}
				}else{
					Router.go('home');
				}
			});
		}
	});
});

Template.register.events({

	'submit form': function(){
		event.preventDefault();
	}
});

