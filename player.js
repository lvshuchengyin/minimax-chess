var PLAYER_TYPE_AI = 0;
var PLAYER_TYPE_HUMAN = 1;

function createAIPlayer(info, algorithm, depth) {
	var obj = {}
	obj.isAI = true;
	obj.info = info;
	obj.depth = depth;
	obj.algorithm = algorithm;
	obj.moveStep = function (gameObj) {
		var res = obj.algorithm(gameObj, gameObj.board, obj.depth, obj, true);
		var step = res.step;
		var score = res.score;
		console.log("AI", obj.info, res.stepCount, step, score);
		gameObj.move(gameObj.board, step, obj);
	};
	return obj;
}

function createHumanPlayer(info) {
	var obj = {}
	obj.isAI = false;
	obj.info = info;
	obj.moveStep = function (gameObj) {

	};
	return obj;
}