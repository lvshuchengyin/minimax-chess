function createGameTicTacToe() {
	var obj = {};

	obj.EmptyText = "";
	obj.XText = "X";
	obj.OText = "O";

	obj.board = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
	];

	obj.boardToString = function (board) {
		var res = "";
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				res += board[x][y] + ",";
			}
		}
		return res;
	};

	obj.renderBoard = function (board) {
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				var v = board[x][y];
				$("#ttt-" + x + y).text(v);
			}
		}
	}

	obj.evalute = function (board, player) {
		if (this.isGameOver(board, player)) {
			return 1;
		}

		if (this.isGameOver(board, this.changePlayer(player))) {
			return -1;
		}

		return 0;
	};

	obj.isGameOver = function (board, player) {
		var win_board = [
			[board[0][0], board[0][1], board[0][2]],
			[board[1][0], board[1][1], board[1][2]],
			[board[2][0], board[2][1], board[2][2]],
			[board[0][0], board[1][0], board[2][0]],
			[board[0][1], board[1][1], board[2][1]],
			[board[0][2], board[1][2], board[2][2]],
			[board[0][0], board[1][1], board[2][2]],
			[board[2][0], board[1][1], board[0][2]],
		];

		for (var i = 0; i < win_board.length; i++) {
			var line = win_board[i];
			var filled = 0;
			for (var j = 0; j < 3; j++) {
				if (line[j] == player.info) {
					filled++;
				}
			}
			if (filled == 3) {
				return true;
			}
		}

		return false;
	};

	obj.isGameOverAll = function (board) {
		return obj.isGameOver(board, obj.playerX) || obj.isGameOver(board, obj.playerO);
	};

	obj.isEnd = function (board) {
		if (obj.isGameOverAll(board)) {
			return true;
		}

		var full = true;
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				if (board[x][y] == obj.EmptyText) {
					if (full) {
						full = false;
					}
					break;
				}
			}
		}
		if (full) {
			return true;
		}

		return false;
	};

	obj.availableSteps = function (board) {
		var steps = [];
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				if (board[x][y] == obj.EmptyText) {
					steps.push({
						"x": x,
						"y": y
					});
				}
			}
		}

		return steps;
	};

	obj.validMove = function (board, step) {
		if (board[step.x][step.y] == obj.EmptyText) {
			return true;
		}

		return false;
	};

	obj.move = function (board, step, player) {
		board[step.x][step.y] = player.info;
	};

	obj.unMove = function (board, step, player) {
		board[step.x][step.y] = obj.EmptyText;
	};

	obj.playerX = null;
	obj.playerO = null;
	obj.playerNow = null;
	obj.changePlayer = function(player) {
		if (obj.playerX === player) {
			return obj.playerO;
		}
		return obj.playerX;
	};
	obj.nextRound = function () {
		console.log(obj.boardToString(obj.board))
		if (obj.isEnd(obj.board)) {
			console.log("end");
			return;
		}
		
		obj.playerNow = obj.changePlayer(obj.playerNow);

		obj.playerNow.moveStep(obj);

		obj.renderBoard(obj.board);

		if (obj.isEnd(obj.board)) {
			console.log("end");
			return;
		}

		if (obj.playerNow.isAI) {
			setTimeout(obj.nextRound, 500);
			return;
		}
	};

	obj.chooseMove = function (x, y) {
		if (obj.playerNow.isAI) {
			return;
		}

		if (obj.isEnd(obj.board)) {
			return;
		}

		var step = {
			"x": x,
			"y": y
		};

		if (!obj.validMove(obj.board, step)) {
			return;
		}

		obj.move(obj.board, step, obj.playerNow);
		obj.renderBoard(obj.board);

		obj.nextRound();
	};

	return obj;
}