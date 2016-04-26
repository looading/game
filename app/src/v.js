var power = {}

power.data = {}

// 设置
power.set = function(id, role) {
	if(power.data[id]) {
		return false;
	}

	power.data[id] = role
	power.render()
	return true;
}

// 删除
power.delete = function(id) {
	$('#' + id).empty()
	delete power.data[id]
	power.render()
}

// 渲染
power.render = function() {
	$('.powerUp').removeClass('powerUp').empty()
	for( var item in power.data) {
		$("#" + item).addClass('powerUp').html('P_' + power.data[item])
	}
}

module.exports = power