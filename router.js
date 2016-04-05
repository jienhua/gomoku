Router.configure({
	layoutTemplate:'main'
});

Router.route('/register');

Router.route('/login');

Router.route('/lobby', {onBeforeAction: function(){
	var currentUser = Meteor.userId();
		if(currentUser){
			this.next();
		}else{
			this.render('login');
		}
	}
});

Router.route('/room/:number',{
	name: 'room',
	template:'room',
	data:function(){
		var number = this.params.number;
		return Rooms.findOne({number:number});
	},
	onBeforeAction: function(){
		var currentUser = Meteor.userId();
		if(currentUser){
			this.next();
		}else{
			this.render('login');
		}
	}
});

Router.route('/', {
	name: 'home',
	template:'home'
});

