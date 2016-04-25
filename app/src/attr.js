var attr = {
	score : 0,
	level : 1,
	round : 1
}

attr.render = function() {
	$('.Score').html(attr.score)
	$('.level').html(attr.level)
	$('.round span').html(attr.round)
}

attr.change = function (type, num) {
	if(type == 'round') {
		attr.level = attr.level == 0? 0: --attr.level
	}
	attr[type] = attr[type]/1 + num/1
	attr.render()
}

module.exports = attr