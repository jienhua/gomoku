// run this when the meteor app is started
Meteor.startup(function(){

	// if there are no boards available create sample data
	if(Boards.find().count() === 0){

		// create an empty board
		var board = initBoard();
		Boards.insert(board);
	}

	// init the all the rooms
	if(Rooms.find().count() === 0){
		var rooms = [
		{
			name:'Lobby',
			current_players:[]
		},
		{
			name:'Room1',
			number:'1',
			players:[],
			full: false,
			isStart: false,
			gameId: '',
			boardId: '',
			messanges:[]
		},
		{
			name:'Room2',
			number:'2',
			players:[],
			full: false,
			isStart: false,
			gameId:'',
			boardId:'',
			messanges:[]
		}
		];

		 _.each(rooms, function(room){
		 	Rooms.insert(room);
		 });
	}

});

function initBoard(){

	var board = [];
	board.pieces = [];
	board.p1_put = [];
	board.p2_put = [];
	board.name = 'new_board';

	// 17
	for(var y=0; y<17; y++){
		for(var x=0; x<17; x++){
			var piece= {};
			if(x===0 && y===0){
				// topleft
				piece.position = 'top_left.png';
			}else if(x===16 && y===0){
				// topright
				piece.position = 'top_right.png';
			}else if(x===16 && y===16){
				// botright
				piece.position = 'bot_right.png';
			}else if(x===0 && y===16){
				// botleft
				piece.position = 'bot_left.png';
			}else if(y===0){
				// top
				piece.position = 'top.png';
			}else if(x===16){
				// right
				piece.position = 'right.png';
			}else if(y===16){
				// bot
				piece.position = 'bot.png';
			}else if(x===0){
				// left
				piece.position = 'left.png';
			}else{
				piece.position = 'mid.png';
			}

			piece.number = x+(y*17);
			piece.move = 'none';
			piece.left = x*41 + 'px';
			piece.top = y*41 + 'px';
			board.pieces.push(piece);
		}
	}
	return board;
}
