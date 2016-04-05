Router.configure({
	layoutTemplate:'main',
	loadingTemplate: 'loading'
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
	},
	waitOn:function(){
		return [Meteor.subscribe('users'), Meteor.subscribe('rooms', 0), 
			    Meteor.subscribe('lobbyMessages')]; 
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
	},
	waitOn:function(){
		var roomNumber = this.params.number;
		return [Meteor.subscribe('rooms', roomNumber), Meteor.subscribe('games'),
			    Meteor.subscribe('boards')];
	}
});

Router.route('/', {
	name: 'home',
	template:'home'
});

