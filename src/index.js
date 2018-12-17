'use strict'
$(function() {
	var p1            = {sign: "o", score: 0},
		p2            = {sign: "x", score: 0},
		count         = 0,
		gameSize      = 0,
		boardSize     = 0,
		roundEnd = false
	;

	function generateBoard(){
		var li = ""
		var maxWidth   = 520
		var boardWidth = gameSize * 60
		var isExceed   = boardWidth >= maxWidth && gameSize <= 25

		$("#p1-bar .win_text").text(p1.sign.toUpperCase()+" WIN")
		$("#p2-bar .win_text").text(p2.sign.toUpperCase()+" WIN")

		if(gameSize > 3){
			$("#tic-tac-toe").append($("#game").removeClass("mid"))
		}

		for (var l = 0; l < boardSize; l++) { li+='<li>+</li>' }
		$("#game").html(li).css('width', isExceed ? maxWidth : boardWidth).fadeIn()
		if(isExceed){
			var resize = maxWidth / gameSize
			$("#game li").css("width", resize).css("height", resize).css("lineHeight", resize+'px').css("fontSize", resize/2)
		}else if(gameSize > 25){ $("#game").css("marginRight", "20px") }
		screenGuide(p1.sign.toUpperCase()+' TURN')
	}
	function clearBoard(clearCount) {
		count = 0
		roundEnd = false
		$("#game").fadeOut(function(){
			$("#game li").text("+").removeClass('disable btn-primary btn-danger').removeData( "owner" )
			$('#clear-board').text('clear')
			$("#game").fadeIn()
			screenGuide(p1.sign.toUpperCase()+' TURN')
		})
	}
	function scanBoard(){
		//diagonal
		for (var initBox = 0; initBox <= gameSize; initBox+=(gameSize-1)) {
			var isInvert  = initBox == gameSize-1
			var maxValue  = isInvert ? boardSize-1 : boardSize
			var increment = isInvert ? gameSize-1  : gameSize+1
			var lead      = ""
			var occurence = 0
			for (var curr = initBox; curr < maxValue; curr+=increment) {
				var cValue = $("#game li").eq(curr).data('owner')
				if(!cValue){
					break;
				}else if(lead == ""){
					lead = cValue; occurence += 1;
				}else if(lead != cValue){
					break;
				}else{
					occurence += 1;
				}
			}
			if(occurence == gameSize){ return lead }
		}

		//row
		for (var row = 0; row < boardSize; row+=gameSize) {
			var lead      = ""
			var occurence = 0
			for (var curr = row; curr < row + gameSize; curr++) {
				var cValue = $("#game li").eq(curr).data('owner')
				if(!cValue){
					break;
				}else if(lead == ""){
					lead = cValue; occurence += 1;
				}else if(lead != cValue){
					break;
				}else{
					occurence += 1;
				}
			}
			if(occurence == gameSize){ return lead }
		}

		//column
		for (var col = 0; col < gameSize; col++) {
			var lead      = ""
			var occurence = 0
			for (var curr = col; curr < boardSize; curr+=gameSize) {
				var cValue = $("#game li").eq(curr).data('owner')
				if(!cValue){
					break;
				}else if(lead == ""){
					lead = cValue; occurence += 1;
				}else if(lead != cValue){
					break;
				}else{
					occurence += 1;
				}
			}
			if(occurence == gameSize){ return lead }
		}
	}
	function screenGuide(string, isAlert){
		if(isAlert){ alert(string) }else{ $('#screen-notice').html(string) }
	}

	$("#clear-board").click(function() { clearBoard(true) });
	$("#start-game").click(function(){
		gameSize  = isNaN($("#game-size").val()) ? 3 : parseInt($("#game-size").val())
		gameSize  = gameSize < (-1) ? gameSize * (-1)
				  : (-1) >= gameSize || gameSize <= 1 ? 3
				  : gameSize
		boardSize = gameSize * gameSize
		generateBoard()
		$('#init-screen').hide().siblings().show()
	});
	$('#game').on('click', 'li',function(){
		if(roundEnd) {clearBoard(true); return;} 
		var $t = $(this)

		if ($t.hasClass('disable')) {
			screenGuide('Invalid Move: Box already selected.', true)
			return
		}

		var turn        = count%2 == 0
		var chara       = turn ? p1.sign : p2.sign
		var charaInvert = turn ? p2.sign : p1.sign
		var charaColor  = turn ? "btn-primary" : "btn-danger"
		$t.text(chara).addClass('disable '+charaColor).data("owner", chara)
		screenGuide(charaInvert.toUpperCase()+' TURN')

		if(count >= gameSize){
			var scanResult = scanBoard()
			if(scanResult){
				var roundWinner = p1.sign
				if(scanResult == p1.sign){
					p1.score++; $('#p1_score').text(p1.score)
				}else{
					roundWinner = p2.sign;
					p2.score++; $('#p2_score').text(p2.score)
				}
				screenGuide(roundWinner.toUpperCase()+' has won the game.<br>Click again to start a new game.')
				$('#clear-board').text('new game')
				roundEnd = true
				return
			}else if (count == boardSize-1){
				screenGuide('It is a tie!.<br>Click again to start a new game.')
				$('#clear-board').text('new game')
				roundEnd = true
				return
			}
		}

		count++
	});
	$("#game-size")[0].addEventListener("keyup", function(e) {
		e.preventDefault();
		if (e.keyCode === 13) { $("#start-game").click(); }
	});
});
