//declare variables
var fieldArray = [];
var fieldSize = 0;
var mineAmt = 0;
var mines = [];
var won = false;

//declare Cell Object
var Cell = function(row, col) {
	this.mine = false;
	this.minesAround = 0;
	this.fieldLocation = [row, col];
	this.hidden = true;
	this.tested = false;
	this.leftClickEnabled = true;
};

function generateFieldArray(fieldSize) {
	for (var i = 0; i < fieldSize; i++) {
		var row = [];
		for (var j = 0; j < fieldSize; j++) {
			row.push(new Cell(i, j));
		}
		fieldArray.push(row);
	}
}

function generateMine(fieldSize) {
	var col = Math.floor(Math.random() * fieldSize);
	var row = Math.floor(Math.random() * fieldSize);
	if (fieldArray[row][col].mine) {
		generateMine(fieldSize);
	} else {
		mines.push([row, col]);
		fieldArray[row][col].mine = true;
	}
}

function generateAllMines(mineAmt, fieldSize) {
	for (var i = 0; i < mineAmt; i++) {
		generateMine(fieldSize);
	}
}

function getNumbersOfMinesAround(fieldSize) {
	for (i = 0; i < fieldSize; i++) {
		for (j = 0; j < fieldSize; j++) {
			checkNeighboringCellsForMines(i, j, fieldSize);
		}
	}
}

function checkNeighboringCellsForMines(i, j, fieldSize) {
	var direction = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 1], [1, 0], [1, -1]];
	if (!fieldArray[i][j].mine) {
		for (a = 0; a < direction.length; a++) {
			var direcA = direction[a][0];
			var direcB = direction[a][1];
			if (i + direcA >= 0 && i + direcA < fieldSize && j + direcB >= 0 && j + direcB < fieldSize) {
				if (fieldArray[i + direcA][j + direcB].mine) {
					fieldArray[i][j].minesAround += 1;
				}
			}
		}
	}
}

function checkForConnectedBlanks(row, col) {
	var direction = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 1], [1, 0], [1, -1]];
	for (var a = 0; a < direction.length; a++) {
		var direcA = direction[a][0];
		var direcB = direction[a][1];
		if (fieldArray[row + direcA] && fieldArray[row + direcA][col + direcB]) {
			if (fieldArray[row + direcA][col + direcB].minesAround === 0 && !fieldArray[row + direcA][col + direcB].tested) {
				fieldArray[row + direcA][col + direcB].hidden = false;
				fieldArray[row + direcA][col + direcB].tested = true;
				$('#cell-' + (row + direcA) + '-' + (col + direcB)).removeClass('hidden').addClass('blank');
				checkForConnectedBlanks((row + direcA), (col + direcB));
			}
		}
	}
}

function buildTheGameBoard() {
  $('#innerContainer').empty();
  fieldArray.forEach(function(row, IndexRow) {
    var divrow = '<div class="field-row">' +
      row.map(function(cell, indexCell) {
        if (cell.mine) {
          return '<div class="cell mine hidden '+IndexRow+','+indexCell+'" id="cell-'+IndexRow+'-'+indexCell+'"></div>'
        } else if (cell.minesAround > 0) {
          return '<div class="cell hidden '+IndexRow+','+indexCell+'" id="cell-'+IndexRow+'-'+indexCell+'"></div>'
        } else {
        	return '<div class="cell hidden '+IndexRow+','+indexCell+'" id="cell-'+IndexRow+'-'+indexCell+'"></div>'
        }
      }).join('') + '</div>';
    $('#innerContainer').append(divrow);
    $('#innerContainer').css({'color': '#ccc', 'font-weight': 'bold'});
  })
}

function pickTextColor(that, row, col) {
	switch (fieldArray[row][col].minesAround) {
		case 0: 
		$(that).addClass('blank');
		case 1:
			$(that).addClass('bg1');
			break;
		case 2:
			$(that).addClass('bg2');
			break;
		case 3:
			$(that).addClass('bg3');
			break;
		case 4:
			$(that).addClass('bg4');
			break;
		case 5:
			$(that).addClass('bg5');
			break;
		case 6:
			$(that).addClass('bg6');
			break;
		case 7:
			$(that).addClass('bg7');
			break;
		case 8:
			$(that).addClass('bg8');
			break;
	}
}

function setupEverything(mineAmt, fieldSize) {
	fieldArray = [];
	mines = [];
	generateFieldArray(fieldSize);
	generateAllMines(mineAmt, fieldSize);
	getNumbersOfMinesAround(fieldSize);
	buildTheGameBoard();
}

function checkWin() {
	var visibleCells= 0;
	for (var i = 0; i < fieldSize; i++) {
		for (var j = 0; j < fieldSize; j++) {
			if (!fieldArray[i][j].mine && !fieldArray[i][j].hidden) {
				visibleCells = visibleCells + 1;
			} 
		}
	}
	if(((fieldSize * fieldSize)-mineAmt)-visibleCells === 0) {
		youWin();
	}
}

function youLose() {
	$('#container').append('<div class="overlay loss"><h1>You Lose</h1><button id="again">Again?</button></div>');
}

function youWin() {
	$('#container').append('<div class="overlay win"><h1>You Win</h1><button id="again">Again?</button></div>');
}

function reset() {
	fieldArray = [];
	fieldSize = 0;
	mineAmt = 0;
	mines = [];
	won = false;
	$('.overlay').remove();
	$('#innerContainer').empty();
}

$('#beginner').click(function() {
	fieldSize = 8;
	mineAmt = 10;
	setupEverything(mineAmt, fieldSize);
});

$('#intermediate').click(function() {
	fieldSize = 16;
	mineAmt = 40;
	setupEverything(mineAmt, fieldSize);
});

$('#expert').click(function() {
	fieldSize = 24;
	mineAmt = 99;
	setupEverything(mineAmt, fieldSize);
});

$('#innerContainer').delegate('.cell', 'click', function(event){
	var id = $(this).attr('id').split('-');
	var coords = [];
	coords = [parseInt(id[1]), parseInt(id[2])];
	var row = coords[0];
	var col = coords[1];
	if (fieldArray[row][col].leftClickEnabled) {
		$(this).removeClass('hidden');
		fieldArray[row][col].hidden = false;
		if (fieldArray[row][col].mine) {
			youLose();
			$('.mine').removeClass('hidden');
		} else if (fieldArray[row][col].minesAround === 0) {
			checkForConnectedBlanks(row, col);
		}
		pickTextColor(this, row, col);
	}
	checkWin();
});
$('#innerContainer').delegate('.cell', 'contextmenu', function(event){
	event.preventDefault();
	var id = $(this).attr('id').split('-');
	var coords = [];
	coords = [parseInt(id[1]), parseInt(id[2])];
	var row = coords[0];
	var col = coords[1];
	if (fieldArray[row][col].leftClickEnabled) {
		fieldArray[row][col].leftClickEnabled = false;
		$(this).addClass('blocked marked');
	} else {
		fieldArray[row][col].leftClickEnabled = true;
		$(this).removeClass('blocked marked');
	}
});
$('#container').delegate('#again', 'click', function() {
	reset();
})