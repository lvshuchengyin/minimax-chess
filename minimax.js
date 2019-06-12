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
	var stime = new Date().getTime();

	function _algorithm(game, board, depth, player, isMaxPlayer) {
		stepCount += 1;

		var res = {
			"step": {},
			"score": MAX_SCORE
		};
		if (isMaxPlayer) {
			res = {
				"step": {},
				"score": MIN_SCORE
			};
		}

		if (depth == 0 || game.isGameOverAll(board) || game.isEnd(board)) {
			var score = game.evalute(board, player);
			return {
				"step": {},
				"score": score
			};
		}

		var steps = game.availableSteps(board);
		shuffle(steps);
		for (var i = 0; i < steps.length; i++) {
			var step = steps[i];

			var movePlayer = player;
			if (!isMaxPlayer) {
				movePlayer = game.changePlayerType(player);
			}
			game.move(board, step, movePlayer);

			var nodeRes = _algorithm(game, board, depth - 1, player, !isMaxPlayer);
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
	var stime = new Date().getTime();

	function _algorithm(game, board, depth, player, isMaxPlayer, alpha, beta) {
		stepCount += 1;

		alpha = alpha || MIN_SCORE;
		beta = beta || MAX_SCORE;

		var res = {
			"step": {},
			"score": MAX_SCORE
		};
		if (isMaxPlayer) {
			res = {
				"step": {},
				"score": MIN_SCORE
			};
		}

		if (depth == 0 || game.isGameOverAll(board) || game.isEnd(board)) {
			var score = game.evalute(board, player);
			return {
				"step": {},
				"score": score
			};
		}

		var steps = game.availableSteps(board);
		shuffle(steps);
		for (var i = 0; i < steps.length; i++) {
			var step = steps[i];

			var movePlayer = player;
			if (!isMaxPlayer) {
				movePlayer = game.changePlayerType(player);
			}
			game.move(board, step, movePlayer);

			var nodeRes = _algorithm(game, board, depth - 1, player, !isMaxPlayer, alpha, beta);
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