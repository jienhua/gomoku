Router.configure({
	layoutTemplate:'main'
});

Router.route('/register');

Router.route('/login');

Router.route('/lobby');

Router.route('/room/:number',{
	name: 'room',
	template:'room',
	data:function(){
		var number = this.params.number;
		return Rooms.findOne({number:number});
	},
	onBeforeAction: function(){
		// var currentUser = Meteor.user().username;
		// var number = this.params.number;
		// var players = Rooms.findOne({number:number}).current_players;
		// var currentUser = Meteor.userId();
		// // if(players.length < 2){
		// // 	console.log('not full');
		// // 	this.next();
		// // }else{
		// // 	this.render("login");
		// // }	
		// Meteor.call('addPlayerIntoRoom', number, currentUser);
		// // Rooms.update(
		// // 	{ number: number},
		// // 	{ $push: {current_players: currentUser}}
		// // );
		// delete Session.keys['gameId'];
		this.next();
	}
});

Router.route('/', {
	name: 'home',
	template:'home'
});

