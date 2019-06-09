function createGameTTT() {
    var obj = {};
	
	obj.Empty = " ";
	obj.PlayerX = "X";
	obj.PlayerO = "O";
	obj.changePlayer = function(player) {
		if (player === obj.PlayerX) {
			return obj.PlayerO;
		}
		
		return obj.PlayerX;
	};

    obj.board = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	];

    obj.cloneBoard = function() {
		var clone = this;
		clone.board = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
		return clone;
    };
	
	obj.boardToString = function(board) {
		var res = "";
		for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
				res += board[x][y]+",";
            }
        }
		return res;
	};
	
	obj.renderBoard= function(board) {
		for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
				var v =  board[x][y];
				$("#ttt-" + x + y).text(v);
            }
        }
	}

    obj.evalute = function(board, player) {
        if (this.isGameOver(board, player)) {
            return 1;
        } 
		
		if (this.isGameOver(board, this.changePlayer(player))) {
            return -1;
        }
		
        return 0;
    };

    obj.isGameOver = function(board, player) {
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
    
    obj.isGameOverAll = function(board) {
        return this.isGameOver(board, this.PlayerX) || this.isGameOver(board, this.PlayerO);
    };
	
	obj.isEnd =  function(board) {
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

    obj.availableSteps = function(board) {
        var steps = [];
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                if (board[x][y] == this.Empty) {
                    steps.push({"x": x, "y": y});
                }
            }
        }

        return steps;
    };

    obj.validMove = function(board, step) {
		if (board[step.x][step.y] == obj.Empty) {
			return true;
		}
		
		return false;
    };

    obj.move = function(board, step, player) {
		board[step.x][step.y] = player;
    };

    obj.unMove = function(board, step, player) {
		board[step.x][step.y] = obj.Empty;
    };

    return obj;
}

function createAIPlayer(info, algorithm, depth) {
	var obj = {}
	obj.info = info;
	obj.depth = depth;
	obj.algorithm = algorithm;
	return obj;
}

var MAX_SCORE = 10000000;
var MIN_SCORE = -10000000;

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


// minimax return [step, score, stepCount]
function minimax(game, board, depth, player, isMaxPlayer) {
	var stepCount = 0
	var stime =new Date().getTime();

	function _algorithm(game, board, depth, player, isMaxPlayer) {
		stepCount+=1;
		
		var res = {"step":{}, "score": MAX_SCORE};
		if (isMaxPlayer) {
			res = {"step":{}, "score": MIN_SCORE};
		}

		if (depth == 0 || game.isGameOverAll(board) || game.isEnd(board)) {
			var score = game.evalute(board, player);
			return {"step":{}, "score": score};
		}

		var steps = game.availableSteps(board);
		shuffle(steps);
		for (var i = 0; i < steps.length; i++) {
			var step = steps[i];
			
			var movePlayer = player;
			if (!isMaxPlayer) {
				movePlayer = ttt.changePlayer(player);
			}
			game.move(board, step, movePlayer);

			var nodeRes = _algorithm(game, board, depth-1, player, !isMaxPlayer);
			nodeRes.step = step;

			game.unMove(board, step, movePlayer);
			
			if (isMaxPlayer) {
				if (nodeRes.score > res.score) {
					res = nodeRes;
				}
				
			} else {
				if (nodeRes.score < res.score) {
					res = nodeRes;
				}
			}
		}

		return res;
	}
	
	var res = _algorithm(game, board, depth, player, isMaxPlayer)
	res.stepCount = stepCount;
	
	var etime = new Date().getTime();
	var usedTime = etime - stime;
	console.log("minimax", stepCount, usedTime / 1000.0);
	return res;
}

// minimaxAlphaBeta return [step, score, stepCount]
function minimaxAlphaBeta(game, board, depth, player, isMaxPlayer) {
	var stepCount = 0
	var stime =new Date().getTime();
	
	function _algorithm(game, board, depth, player, isMaxPlayer, alpha, beta) {
		stepCount += 1;
		
		alpha = alpha || -999999999;
		beta = beta || 999999999;
		
		var res = {"step":{}, "score": MAX_SCORE};
		if (isMaxPlayer) {
			res = {"step":{}, "score": MIN_SCORE};
		}

		if (depth == 0 || game.isGameOverAll(board) || game.isEnd(board)) {
			var score = game.evalute(board, player);
			return {"step":{}, "score": score};
		}

		var steps = game.availableSteps(board);
		shuffle(steps);
		for (var i = 0; i < steps.length; i++) {
			var step = steps[i];
			
			var movePlayer = player;
			if (!isMaxPlayer) {
				movePlayer = ttt.changePlayer(player);
			}
			game.move(board, step, movePlayer);

			var nodeRes = _algorithm(game, board, depth-1, player, !isMaxPlayer, alpha, beta);
			nodeRes.step = step;

			game.unMove(board, step, movePlayer);
			
			if (isMaxPlayer) {
				if (nodeRes.score > res.score) {
					res = nodeRes;
					alpha = nodeRes.score;
				}
				
				if (alpha >= beta) {
                    break;
                }
				
			} else {
				if (nodeRes.score < res.score) {
					res = nodeRes;
					beta = nodeRes.score;
				}
				
				if (alpha >= beta) {
                    break;
                }
			}
		}

		return res;
	}
	
	var res = _algorithm(game, board, depth, player, isMaxPlayer)
	res.stepCount = stepCount;
	
	var etime = new Date().getTime();
	var usedTime = etime - stime;
	console.log("minimaxAlphaBeta", stepCount, usedTime / 1000.0);
	return res;
}

var ttt = createGameTTT();
var playerX = createAIPlayer(ttt.PlayerX, minimax, 5);
var playerO = createAIPlayer(ttt.PlayerO, minimaxAlphaBeta, 3);

var turn = 0;
function runStep() {
	var player = playerX;
	if (turn % 2 == 0) {
		player = playerO;
	}
	turn += 1;
	
	var res = player.algorithm(ttt, ttt.board, player.depth, player.info, true);
	var step = res.step;
	var score = res.score;
	
	console.log("minimax", player.info, res.stepCount, step, score);
	
	var res2 = minimaxAlphaBeta(ttt, ttt.board, player.depth, player.info, true);
	var step2 = res2.step;
	var score2 = res2.score;
	
	console.log("minimaxAlphaBeta", player.info, res2.stepCount, step2, score2);
	
	if (step.x != step2.x || step.y != step2.y || score != score2) {
		console.log("!!! ", step, step2, score, score2);
	}
	
	ttt.move(ttt.board, step, player.info);
	
	console.log(player.info, res.stepCount, step, score, ttt.boardToString(ttt.board));
	
	ttt.renderBoard(ttt.board);
	
	if (!ttt.isGameOverAll(ttt.board) && !ttt.isEnd(ttt.board)) {
		setTimeout(runStep, 1000);
	}
}

runStep();


