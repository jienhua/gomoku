Template.register.events({

	'submit form': function(){
		event.preventDefault();
		var username = $('[name=username]').val();
		var password = $('[name=password]').val();
		Accounts.createUser({
			username: username,
			password: password,
			profile:{
				login: true,
				rankPoint: 10
			}
		},function(error){
			if(error){
				console.log(error.reason);
			}else{
				Router.go('home');
			}
		});
	}
});

