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
	}

});

Template.room.events({

	'click #ready_btn':function(event){
		
		var currentPlayers = Rooms.findOne({_id:this._id}).players.length;
		var isRoomFull = false;
		if(currentPlayers >= 2){
			isRoomFull = true;
		}else{
			Rooms.update({_id:this._id},{$set:{full: false}});
		}
		var user = Meteor.user();
		if(Rooms.findOne({$and:[{_id:this._id},{players:{$in:[user.username]}}]}))
		{
			// fidn the player in the playerlist, delete player from list
			Rooms.update(
				{_id:this._id}, 
				{$pull:{players:user.username}}
			);
			
			Rooms.update({_id:this._id},{$set:{full: false}});
		}else
		{
			if(!isRoomFull){
				Rooms.update(
					{_id:this._id},
					{$push:{players: user.username}}
				);

				if(currentPlayers === 1){
					Rooms.update({_id:this._id},{$set:{full: true}});
				}
			}
		}
	},
	'click #start_btn':function(event){

		// var gameId;
		var roomNumber = this.number;

		Meteor.call('create_game', this.players, roomNumber, function(error, result){
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
});

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

window.onbeforeunload = function () {
    return "Are you sure that you want to leave this page?";
}