var power = {}

power.data = {}

power.set = function(id, role) {
	if(power.data[id]) {
		console.log(333);
		return false;
	}

	power.data[id] = role
	power.render()
	return true;
}

power.delete = function(id) {
	$('#' + id).empty()
	delete power.data[id]
	power.render()
}

power.render = function() {
	$('.powerUp').removeClass('powerUp').empty()
	for( var item in power.data) {
		$("#" + item).addClass('powerUp').html('P_' + power.data[item])
	}
}

module.exports = power