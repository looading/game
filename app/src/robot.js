var config = require('./config')
var power = require('./v')
var attr = require('./attr')
var tool = require('./tool')

var robot = {}


robot.data = {}


// 设置 robot的坐标
robot.set = function(id) {
	if(robot.data[id]) {
		return false
	}

	robot.data[id] = id
	robot.render()
	return true
}

// 渲染
robot.render = function() {
	$('.robot').removeClass('robot').empty()
	for(var item in robot.data) {
		$("#" + item).addClass('robot').html('R')
	}
	
}

// 移动
robot.moveTo = function() {
	

	for(var item in robot.data) {
		var pos = item.split('_')
		var tmp = {
			robot : [],
			power : [],
			free : [],
			hero : []
		}
		var posArr = getId(pos[1], pos[2])
		for(var i=0; i<posArr.length; i++) {
			var obj = $("#"+posArr[i])
			if(obj.attr('class')) {
				if(obj.attr('class').split(' ').length == 1) {
					tmp.free.push(posArr[i])
				} else if(obj.hasClass('robot')) {
					tmp.robot.push(posArr[i])
				} else if(obj.hasClass('powerUp')) {
					tmp.power.push(posArr[i])
				} else if(obj.hasClass('hero')) {
					tmp.hero.push(posArr[i])
				}
			}
		}

		if(tmp.hero.length!=0) {

			if(attr.level != 0) {
				delete robot.data[item]
				attr.change('score', 100)
				tool.createMsg('System','hero kill a robot,win 100 score', 'text-info')
			} else {
				alert('failed!')
				tool.creatMsge('System','hero is killed! score:' + attr.score, 'text-danger')
			}

			continue;
		}

		if(tmp.power.length!=0) {
			power.delete(tmp.power[0])

			var index = Math.floor(Math.random()*(tmp.power.length))
			delete robot.data[item]
			robot.data[tmp.power[index]] = item
			tool.createMsg('System', 'a robot destory a power-up', 'text-info')
			continue;
		}

		if(tmp.free.length!=0) {
			var index = Math.floor(Math.random()*(tmp.free.length))
			delete robot.data[item]
			robot.data[tmp.free[index]] = item
			tool.createMsg('System','a robot has moved', 'text-info')
			continue;
		}

		continue;

	}
	robot.render()
}

// 删除robot
robot.delete = function(id) {
	delete robot.data[id]
	robot.render()
}


function getId(x, y) {
	var tox = toy = 0
	var posArr = []
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			if(i==0 && i==j) continue;
			var tmp_x = x/1 + config.toArr[i],
				tmp_y = y/1 + config.toArr[j]

			posArr.push("cell_" + tmp_x + "_" + tmp_y)
		}
	}
	console.log(posArr, '-----');
	return posArr
}

module.exports = robot