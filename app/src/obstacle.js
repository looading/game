var obstacle = {}
 
obstacle.data = []

obstacle.render = function() {
	$('obstacle').removeClass('obstacle')
	for (var i = obstacle.data.length - 1; i >= 0; i--) {
		$('#' + obstacle.data[i]).addClass('obstacle')
	}
}
obstacle.set = function(id) {
	if(obstacle.data.indexOf(id) == -1) {
		obstacle.data.push(id)
		obstacle.render()
		return true
	}
	return false
	
}



module.exports = obstacle