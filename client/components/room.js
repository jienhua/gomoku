Template.room.helpers({
	'username':function(){
		var userId = Meteor.userId();
		var user = Meteor.users.findOne(userId);
		return user.username;
	},
	'player_list':function(){
		return Rooms.findOne({_id:this._id});
	},
	'ready': function(){
		var userId = Meteor.userId();
		var user = Meteor.users.findOne(userId);
		var name = user && user.username;
		if(Rooms.findOne({$and:[{_id:this._id},{players:{$in:[name]}}]})){
			return 'Not Ready';
		}else{
			return 'Ready';
		}

	},
	'roomNumber':function(){
		return this.number;
	},
	'gameId':function(){
		return this.gameId;
	},
	'gameName':function(){
		var gameId = this.gameId;
		var currentGame = Games.findOne({_id: gameId});
		return currentGame.name;
	},
	'blackOrWhite':function(){
		var gameId = this.gameId;
		var currentGame = Games.findOne({_id: gameId});
		var userId = Meteor.userId();
		var user = Meteor.users.findOne(userId);
		var name = user && user.username;
		if(currentGame.player1 === name){
			return 'trid_black.png';
		}else{
			return 'trid_white.png';
		}
	},
	'whosTurn':function(){
		var gameId = this.gameId;
		var currentGame = Games.findOne({_id: gameId});
		var userId = Meteor.userId();
		var user = Meteor.users.findOne(userId);
		var name = user && user.username;
		var messange = '';

		if(currentGame.turn%2===0 && currentGame.player1===name){
			messange = 'Your Turn to play';
		}else if(currentGame.turn%2===1 && currentGame.player2===name){
			messange = 'Your Turn to play';
		}else{
			messange = "Your Opponent's Turn";
		}
		return messange;
	},
	'isGameEnd':function(){
		var gameId = this.gameId;
		var currentGame = Games.findOne({_id: gameId});
		return currentGame.end;
	},
	'winner':function(){
		var gameId = this.gameId;
		var currentGame = Games.findOne({_id: gameId});
		return currentGame.winner;
	},
	'isSurrender':function(){
		var gameId = this.gameId;
		var currentGame = Games.findOne({_id: gameId});
		if(currentGame.surrender === ''){
			return false;
		}else{
			return true;
		}
	},
	'surrender':function(){
		var gameId = this.gameId;
		var currentGame = Games.findOne({_id: gameId});
		return currentGame.surrender;
	},
	'isPlayer':function(){
		var user = Meteor.user();
		if(Rooms.findOne({$and:[{_id:this._id},{players:{$in:[user.username]}}]})){	
			return true;
		}else{
			return false;
		}
	}

});

Template.room.events({

	'click #ready_btn':function(event){
		
		var currentPlayers = Rooms.findOne({_id:this._id}).players.length;
		var isGameFull = false;
		if(currentPlayers >= 2){
			isGameFull = true;
		}else{
			// Rooms.update({_id:this._id},{$set:{full: false}});
			Meteor.call('setGameIsFull', this._id, false);
		}
		var user = Meteor.user();
		if(Rooms.findOne({$and:[{_id:this._id},{players:{$in:[user.username]}}]}))
		{
			// find the player in the playerlist, delete player from list
			// Rooms.update(
			// 	{_id:this._id}, 
			// 	{$pull:{players:user.username}}
			// );
			Meteor.call('inOutGame', this._id, 'out', user.username);
			
			// Rooms.update({_id:this._id},{$set:{full: false}});
			Meteor.call('setGameIsFull', this._id, false);
		}else
		{
			if(!isGameFull){
				// Rooms.update(
				// 	{_id:this._id},
				// 	{$push:{players: user.username}}
				// );
				Meteor.call('inOutGame', this._id, 'in', user.username);

				if(currentPlayers === 1){
					// Rooms.update({_id:this._id},{$set:{full: true}});
					Meteor.call('setGameIsFull', this._id, true);
				}
			}
		}
	},
	'click #start_btn':function(event){

		// var gameId;
		var roomNumber = this.number;
		var players = this.players;
		startNewGame(roomNumber, players);
	},
	'click #surrender_btn': function(event){
		console.log('clikc surrender button');
		var gameId = this.gameId;
		console.log('gameId: ' + gameId);
		var currentGame = Games.findOne({_id: gameId});
		var roomNumber = this.number;
		var surrender = confirm('Do you wnat to surrender this game?');
		if(surrender){
			Meteor.call('surrender', gameId, roomNumber);
		}
	},
	'click #reset_game_btn': function(event){
		var roomNumber = this.number;
		Meteor.call('reset_game', roomNumber);
	},
	'click #leave_btn':function(event){
		var user = Meteor.user();
		if(Rooms.findOne({$and:[{_id:this._id},{players:{$in:[user.username]}}]}))
		{	
			var roomNumber = this.number;
			//if(confirm('Leave the room? if you are currently in the game, you will automatically lost the game.')){}
			Meteor.call('leave_room', roomNumber, function(error, result){
				if(error){
					throw new Meteor.Error('leave room Error', 'Error when leaving the room');
				}else{
					Meteor.call('checkRoomPlayer', roomNumber);
				}
			});
		}
		Router.go('lobby');
	}
});

function startNewGame(roomNumber, players){
	Meteor.call('create_game', players, roomNumber, function(error, result){
		if(error){
			throw new Meteor.Error('Create Game Error', 'There is a error creating game');
		}else{
				Meteor.call('create_board', result, roomNumber, function(error, result){
				if(error){
					throw new Meteor.Error('Create Board Error', 'There is a error createing board');
				}
			});
		}
	});
}


// window.onbeforeunload = function (event) {
//     var message = 'Important: Please click on \'Save\' button to leave this page.';
//     if (typeof event == 'undefined') {
//         event = window.event;
//     }
//     if (event) {
//         event.returnValue = message;
//     }
//     return message;
// };

// window.onbeforeunload = function () {
//     return "Are you sure that you want to leave this page?";
// }

