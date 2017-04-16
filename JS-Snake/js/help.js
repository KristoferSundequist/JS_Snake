///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////          HELP CODE           ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//Checks if an array contains a value
function Contains(a, obj) {
	var i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}

//Clears canvas
function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Returns a sorted array of 'n' random numbers between 'min' and 'max'.
function getRandomNumbers(n, min, max){
	var values = [], i = max;
	while(i >= min){
		values.push(i--);
	}
	var results = [];
	var maxIndex = max;
	var index = 0;
	for(i=1; i <= n; i++){
		maxIndex--;
		index = Math.floor(maxIndex * Math.random());
		results.push(values[index]);
		values[index] = values[maxIndex];
	}
	return results.sort();
}

//Returns a random number between 'from' and 'to'
function randomFromInterval(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}