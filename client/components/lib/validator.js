$.validator.setDefaults({
	rules:{
	    username:{
		required: true,
	},
	password:{
			required: true,
			minlength: 6
		}
	},
	messages:{
		username:{
			required: 'You must enter an Username. ex: River Taro'
		},
		password:{
			required: 'You must enter a password.',
			minlength: 'Your password must be at least {0} characters.'
		}
	}
});