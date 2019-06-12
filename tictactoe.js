var PLAYER_TYPE_AI = 0;
var PLAYER_TYPE_HUMAN = 1;

function createGameTicTacToe() {
	var obj = {};

	obj.Empty = " ";
	obj.PlayerTypeX = "X";
	obj.PlayerTypeO = "O";
	obj.changePlayerType = function (player) {
		if (player === obj.PlayerTypeX) {
			return obj.PlayerTypeO;
		}

		return obj.PlayerTypeX;
	};

	obj.board = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
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

		if (this.isGameOver(board, this.changePlayerType(player))) {
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
				if (line[j] == player) {
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
		return this.isGameOver(board, this.PlayerTypeX) || this.isGameOver(board, this.PlayerTypeO);
	};

	obj.isEnd = function (board) {
		var full = true;
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				if (board[x][y] == this.Empty) {
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
				if (board[x][y] == this.Empty) {
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
		if (board[step.x][step.y] == obj.Empty) {
			return true;
		}

		return false;
	};

	obj.move = function (board, step, player) {
		board[step.x][step.y] = player;
	};

	obj.unMove = function (board, step, player) {
		board[step.x][step.y] = obj.Empty;
	};

	obj.playerX = null;
	obj.playerO = null;
	obj.playerNow = null;
	obj.nextRound = function () {
		if (obj.playerNow === obj.playerX) {
			obj.playerNow = obj.playerO;
		} else {
			obj.playerNow = obj.playerX
		}

		obj.playerNow.moveStep(obj);

		obj.renderBoard(obj.board);

		if (obj.isGameOverAll(obj.board) || obj.isEnd(obj.board)) {
			return;
		}

		if (obj.playerNow.isAI) {
			setTimeout(obj.nextRound, 1000);
			return;
		}
	};

	obj.chooseMove = function (x, y) {
		if (obj.playerNow.isAI) {
			return;
		}

		var step = {
			"x": x,
			"y": y
		};

		if (!obj.validMove(obj.board, step)) {
			return;
		}

		obj.move(obj.board, step, obj.playerNow.info);

		obj.renderBoard(obj.board);

		if (obj.isGameOverAll(obj.board) || obj.isEnd(obj.board)) {
			return;
		}

		obj.nextRound();
	};

	return obj;
}

function createAIPlayer(info, algorithm, depth) {
	var obj = {}
	obj.isAI = true;
	obj.info = info;
	obj.depth = depth;
	obj.algorithm = algorithm;
	obj.moveStep = function (gameObj) {
		var res = obj.algorithm(gameObj, gameObj.board, obj.depth, obj.info, true);
		var step = res.step;
		var score = res.score;
		console.log("AI", obj.info, res.stepCount, step, score);
		gameObj.move(gameObj.board, step, obj.info);
	};
	return obj;
}

function createHumanPlayer(info) {
	var obj = {}
	obj.info = info;
	obj.moveStep = function (gameObj) {

	};
	return obj;
}

var turn = 0;

function runStep(ttt, playerX, playerO) {
	var player = playerX;
	if (turn % 2 == 0) {
		player = playerO;
	}
	turn += 1;

	var res = player.algorithm(ttt, ttt.board, player.depth, player.info, true);
	var step = res.step;
	var score = res.score;
	console.log("minimax", player.info, res.stepCount, step, score);

	// var res2 = minimaxAlphaBeta(ttt, ttt.board, player.depth, player.info, true);
	// var step2 = res2.step;
	// var score2 = res2.score;
	// console.log("minimaxAlphaBeta", player.info, res2.stepCount, step2, score2);

	// if (step.x != step2.x || step.y != step2.y || score != score2) {
	// 	console.log("!!! ", step, step2, score, score2);
	// }

	ttt.move(ttt.board, step, player.info);

	console.log(player.info, res.stepCount, step, score, ttt.boardToString(ttt.board));

	ttt.renderBoard(ttt.board);

	if (!ttt.isGameOverAll(ttt.board) && !ttt.isEnd(ttt.board)) {
		setTimeout(function () {
			runStep(ttt, playerX, playerO);
		}, 1000);
	}
}