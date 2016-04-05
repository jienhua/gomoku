Meteor.methods({
	
	'addPlayerIntoRoom': function(number, userId){
		return Rooms.update(
			{'number': number},
			{$push:{'current_players': userId}}
		);
	},
	'create_game':function(players, roomNumber){

		// return id of game
		
		var player1 ='';
		var player2 ='';

		// decoded who goes first.
		if(whoGoesFirst() === 0){
			player1 = players[0];
			player2 = players[1];
		}else{
			player1 = players[1];
			player2 = players[0];
		}

		var newGame = Games.insert({
			name: players[0]+' VS '+players[1],
			turn: 0,
			time: 0,
			createdAt: new Date,
			player1: player1,
			player2: player2,
			surrender:'',
			winner: '',
			end: false
		});

		Rooms.update({number:roomNumber}, 
					 {$set:{
					 	'gameId': newGame,
					 	'isStart': true 
					 }});

		return newGame;
	},
	'create_board':function(gameId, roomNumber){
		
		var newBoard = Boards.findOne({'name':'new_board'});
		newBoard.gameId = gameId;
		newBoard.name = 'used';
		delete newBoard._id;
		newBoard = Boards.insert(newBoard);
		// console.log(roomNumber);
		// console.log(newBoard);
		Rooms.update({'number':roomNumber},{$set:{'boardId': newBoard}});

		return newBoard;
	},
	'putPiece':function(boardId, number, gameId){
		
		var currentGame = Games.findOne({'_id':gameId});
		var pieceType = whichPieces(currentGame);
		
		if(isRightTurn(currentGame) && 
		   isAvailableMove(boardId, number) &&
		   !currentGame.end){
			
			if(pieceType ==='trid_black.png'){

				Boards.update(
					{
						'_id': boardId,
						'pieces':{
							$elemMatch:{
								'number': parseInt(number)
							}
						}
					},
					{
						$set:{
							'pieces.$.position': pieceType,
							'pieces.$.move': 'moved'
						},
						$push:{
							'p1_put': parseInt(number)
						}
							
					}
				);

			}else{

				Boards.update(
					{
						'_id': boardId,
						'pieces':{
							$elemMatch:{
								'number':parseInt(number)
							}
						}
					},
					{
						$set:{
							'pieces.$.position': pieceType,
							'pieces.$.move': 'moved'
						},
						$push:{
							'p2_put': parseInt(number)
						}
							
					}
				);

			}

			Games.update(
				{
					'_id': gameId
				},
				{
					$inc:{
						'turn':1
					}
				}
			);

			if(checkWin(currentGame, boardId, number)){
				console.log('gameId: ' + gameId);

				var currentUserName = Meteor.user().username;
				console.log('winner: ' + currentUserName);
				Games.update(
					{
						'_id': gameId
					},
					{
						$set:{
							'winner': currentUserName,
							'end': true
						}
					}
				);

				modifyPoint(currentUserName, 'checkWin', gameId);
			}

			return true;
		}else{
			return false;
		}
	},
	'surrender':function(gameId, roomNumber){
		var currentUserName = Meteor.user().username;
		surrender(gameId, currentUserName);
		modifyPoint(currentUserName, 'surrender', gameId);
	},
	'reset_game': function(roomNumber){
		resetGame(roomNumber);
	},
	'leave_room':function(roomNumber){
		var currentUserName = Meteor.user().username;
		// check if game start in this room
		var room = Rooms.findOne({'number': roomNumber});
		if(room.isStart){
			if(room.players.length == 2){
				var gameId = room.gameId;
				var currentGame = Games.findOne({'_id': gameId});
				if(!currentGame.end){
					surrender(gameId, currentUserName);
					modifyPoint(currentUserName, 'leave_room', gameId);
				}	
			}else{
				resetGame(roomNumber);
			}
		}
		// check if user is in the ready list
		if(room.players.indexOf(currentUserName) >= 0){
			Rooms.update(
				{
					'number': roomNumber
				},
				{
					$pull:{
						'players': currentUserName
					}
				}
			);
		}
	},
	'checkRoomPlayer':function(roomNumber){
		var room = Rooms.findOne({'number': roomNumber});
		if(room.players.length == 0){
			resetGame(roomNumber);
		}
	},
	'submitLobbyMessage':function(data){
		data.time = Date.now();
		LobbyMessages.insert(data);
	},
	'inOutGame':function(id, inOrOut, name){
		if(inOrOut === 'in'){
			Rooms.update(
				{
					'_id': id
				},
				{
					$push:{
						players:name
					}
				}
			);
		}else{
			Rooms.update(
				{
					'_id': id
				},
				{
					$pull:{
						players:name
					}
				}
			);
		}
	},
	'setGameIsFull':function(id, isFull){
		Rooms.update({_id:id}, {$set:{full:isFull}});
	},
	submitRoomMessage:function(data, number){
		console.log(data);
		console.log(number);
		data.time = Date.now();
		Rooms.update({'number': number},{
			$push:{messanges:data}
		});
		
	}
});

function whoGoesFirst(){
	return Math.floor((Math.random()*2));
}

function whichPieces(currentGame){
	if(currentGame.turn%2 ===0){
		return 'trid_black.png';
	}else{
		return 'trid_white.png';
	}
}

function isRightTurn(currentGame){
	var currentUserName = Meteor.user().username;
	if(currentGame.turn%2 ===0 && currentGame.player1 === currentUserName){
		return true;
	}else if(currentGame.turn%2 !==0 && currentGame.player2 === currentUserName){
		return true;
	}else{
		return false;
	}
}

function isAvailableMove(boardId, number){
	
	var isAvailable = Boards.findOne(
		{	
			'_id':boardId,
			'pieces':
			{
				$elemMatch:
				{
					'number':parseInt(number), 
					'move':'none'
				}
			}
		}
	);

	if(isAvailable)
		return true;
	else
		return false;
}

function checkWin(currentGame, boardId, number){
	var turn = currentGame.turn;
	var currentBoard = Boards.findOne({'_id':boardId});
	var list;
	var result = false;
	var y = Math.floor(number/17);
	var x = number%17;
	
	if(turn%2===0){
		list = currentBoard.p1_put;
	}else{
		list = currentBoard.p2_put;
	}
	
	if(checkLine(list, x, y, 0, 1) + checkLine(list, x, y, 0, -1) + 1  >= 5 ||
	   checkLine(list, x, y, 1, 0) + checkLine(list, x, y, -1, 0) + 1  >= 5 ||
	   checkLine(list, x, y, 1, 1) + checkLine(list, x, y, -1, -1) + 1 >= 5 ||
	   checkLine(list, x, y, -1, 1) + checkLine(list, x, y, 1, -1) + 1 >= 5){

		result = true;
	}
	// else{
	// 	console.log('List: '+list);
	// 	// |  up to down
	// 	console.log('1| 1: '+checkLine(list, x, y, 0, 1)+' /2: '+checkLine(list, x, y, 0, -1));
	// 	// -  left to right
	// 	console.log('2| 1: '+checkLine(list, x, y, 1, 0)+' /2: '+checkLine(list, x, y, -1, 0));
	// 	// \  left up to right down
	// 	console.log('3| 1: '+checkLine(list, x, y, 1, 1)+' /2: '+checkLine(list, x, y, -1, -1));
	// 	// /  left down to right up
	// 	console.log('4| 1: '+checkLine(list, x, y, -1, 1)+' /2: '+checkLine(list, x, y, 1, -1));
	// }

	return result;
}

function checkLine(list, x, y, dx, dy){

	var link = 0;

	for(var i=0; i<5; i++){
		x += dx; 
		y += dy;
		var number = (y*17) + x;
		if(!isInBound(x, y) || list.indexOf(number) < 0){
			return link;
		}

		link+=1;
	}
	
	return link;
}

function isInBound(x, y){
	if(x < 0 || x > 17 || y < 0 || y > 17)
		return false;
	else
		return true;
} 

function surrender(gameId, currentUserName){
	var winner = '';
	var currentGame = Games.findOne({_id:gameId});
	if(currentGame.player1 === currentUserName){
		winner = currentGame.player2;
	}else{
		winner = currentGame.player1;
	} 
	Games.update(
		{
			'_id': gameId
		},
		{
			$set:{
				'surrender': currentUserName,
				'winner': winner,
				'end': true
			}
		}
	);	
}

function resetGame(roomNumber){
	
	Rooms.update(
		{
			'number': roomNumber
		},
		{
			$set:{
				'isStart': false,
				'full': false,
				'gameId': '',
				'boardId': '',
				'players':[]
			}
		}
	);
}

function findTitle(point){
	
	var title ='';
	if(point <= 0){
		title = 'Dirt';
	}else if(point >= 1 && point < 5){
		title = 'Bronze';
	}else if(point >= 5 && point < 15){
		title = 'Silver';
	}else if(point >= 15 && point <20){
		title = 'Gold';
	}else if(point >= 20 && point < 30){
		title = 'Platinum';
	}else if(point >= 30 && point < 9999){
		title = 'Diamond';
	}else if(point > 9999){
		title = 'The God';
	}
	return title;
}

function modifyPoint(name, title, gameId){
	if(title === 'checkWin'){
		var winner = name;
		var loser = '';
		var currentGame = Games.findOne({'_id': gameId});
		if(currentGame.player1 === winner){
			loser = currentGame.player2;
		}else{
			loser = currentGame.player1;
		}
		console.log(title);
		console.log('winner: ' + winner);
		console.log('loser: ' + loser);
		// modified point
	}else{

		var winner ='';
		var loser = name;
		var currentGame = Games.findOne({'_id': gameId});
		if(currentGame.player1 === loser){
			winner = currentGame.player2;
		}else{
			winner = currentGame.player1;
		}

		console.log(title);
		console.log('winner: ' + winner);
		console.log('loser: ' + loser);
	}

	Meteor.users.update(
		{
			'username':winner
		},
		{
			$inc:{
				'profile.rankPoint':1
			}
		}
	);
	
	winner = Meteor.users.findOne({'username':winner});

	Meteor.users.update(
		{
			'username':winner.username
		},
		{
			$set:{
				'profile.title': findTitle(winner.profile.rankPoint)
			}
		}
	);
	Meteor.users.update(
		{
			'username':loser
		},
		{
			$inc:{
				'profile.rankPoint':-1
			}
		}
	);
	loser = Meteor.users.findOne({'username':loser});
	Meteor.users.update(
		{
			'username':loser.username
		},
		{
			$set:{
				'profile.title': findTitle(loser.profile.rankPoint)
			}
		}
	); 
}