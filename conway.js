// var cell = function(rect, status){

//     this.status = status;
//     this.rect = rect;
// }

// cell.prototype.draw = function(){
//     if (this.status == 1) this.rect.classed("alive", true);
//     else this.rect.classed("dead", true);
// }

var game = function(rows, cols, size){

    this.rows = Number(rows || 50);
    this.cols = Number(cols || 50);

    this.matrix = d3.range(rows)
	.map(function(){
	    return d3.range(cols)
		.map(function(){ return 0; })
	})

    this.dotsize = size || 3;

    d3.select("#container").html("");
    
    this.svg = d3.select("#container").append("svg")
	.style("height", rows * this.dotsize)
	.style("width", rows * this.dotsize)
    
    return this;
    
}

game.prototype.next = function(){
    
    var that = this
    var new_matrix = JSON.parse(JSON.stringify(that.matrix)) // matrix so we're not mutating it
    this.matrix.forEach(function(curr_row, i){
	curr_row.forEach(function(curr_col, j){

	    var current_row = i;
	    var current_col = j;

	    var top_row = current_row - 1;
	    var bottom_row = current_row + 1;

	    var left_col = current_col - 1;
	    var right_col = current_col + 1;

	    if (bottom_row >= that.rows) { bottom_row = 0; }
	    if (top_row < 0 ) { top_row = that.rows - 1; }
	    if (right_col >= that.cols) { right_col = 0; }
	    if (left_col < 0 ) { left_col = that.cols - 1; }

	    var neighbors = 0;

	    // var that = this;
	    var check = function(row, col){
		var row = Number(row);
		var col = Number(col);

		if ( that.matrix[row][col] == 1 ) { neighbors += 1; }
	    }

	    check(top_row, left_col);
	    check(top_row, current_col);
	    check(top_row, right_col);

	    check(current_row, left_col);
	    check(current_row, right_col);

	    check(bottom_row, left_col);
	    check(bottom_row, current_col);
	    check(bottom_row, right_col);

	    if (that.matrix[current_row][current_col] == 0 && neighbors != 3 )
		return;

	    // if a living cell is surrounded by more than 3 neighbors it dies
	    if (that.matrix[current_row][current_col] == 1 && neighbors > 3)
		new_matrix[current_row][current_col] = 0;
	    // if a living cell is surrounded by less than 2 neigbbors it dies
	    else if (that.matrix[current_row][current_col] == 1 && neighbors < 2)
		new_matrix[current_row][current_col] = 0;
	    // if a dead cell is surrounded by three  neighbors it springs to life
	    else if (that.matrix[current_row][current_col] == 0 & neighbors == 3)
		new_matrix[current_row][current_col] = 1;
	    
	});
    });

    this.matrix = new_matrix;
}


game.prototype.draw = function(){

    this.svg.html("");

    for (var current_row in this.matrix){
	for(var current_col in this.matrix[current_row]){

	    if (this.matrix[current_row][current_col] != 1) continue;
	    
	    this.svg.append("rect")
		.style("width", this.dotsize)
		.style("height", this.dotsize)
		.style("x", current_col * this.dotsize)
		.style("y", current_row * this.dotsize)
		.style("rx", this.dotsize) // round
		.style("ry", this.dotsize) // round
		.classed("alive", this.matrix[current_row][current_col] == 1)
	}
    }
}

game.prototype.randomize = function(){

    for (var current_row in this.matrix){
	for(var current_col in this.matrix[current_row]){
	    this.matrix[current_row][current_col] = Math.round(Math.random() * 10 > 9 ? 1 : 0);
	}
    }


}

game.prototype.play = function(){

    var that = this;
    
    this.interval = setInterval(function(){
	that.step();
    }, 150);
    
}

game.prototype.stop = function(){
    clearInterval(this.interval);
}

game.prototype.step = function(){
    this.next();
    this.draw();
}

var g = new game(100,  100, 5);
g.randomize();

g.play();

g.svg.on("click", function(){
    g.randomize();
    g.play();
})
