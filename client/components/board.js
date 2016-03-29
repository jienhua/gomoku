Template.board.helpers({
	'cell':function(){
		// return showboard();
		var gameId = this.gameId;
		var board = Boards.findOne({gameId:gameId});
		var boardId = board && board._id;
		var pieces = board && board.pieces;

		Session.set('boardId', boardId);
		Session.set('gameId', gameId);

		return pieces;
	}
});


Template.board.events({

	'click .cell':function(event){

		var number = $(event.target).attr('name');
		var gameId = Session.get('gameId');
		var boardId = Session.get('boardId');
		Meteor.call('putPiece', boardId, number, gameId);	
	}
});
