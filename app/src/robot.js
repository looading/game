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
	console.info(robot.data);	
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
		var posArr = getIdList(pos[1], pos[2])
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

		// 若附近有hero，则优先hero
		if(tmp.hero.length!=0) {

			if(attr.level != 0) {
				delete robot.data[item]
				attr.change('score', 100)
				tool.createMsg('System','hero kill a robot,win 100 score', 'text-info')
			} else {
				alert('failed!')
				$(window).off('keypress')
				tool.creatMsg('System','hero is killed! score:' + attr.score, 'text-danger')
				
			}
			config.moveAble = true
			robot.render()
			continue;
		}

		// 若附近没有hero但是有 power-up 则优先摧毁power-up
		if(tmp.power.length!=0) {
			

			var index = Math.floor(Math.random()*(tmp.power.length))
			power.delete(tmp.power[0])
			delete robot.data[item]
			robot.data[tmp.power[index]] = item
			tool.createMsg('System', 'a robot destory a power-up', 'text-info')
			config.moveAble = true
			robot.render()
			continue;
		}

		// 若周围没有hero也没有power-up  则向靠近hero的方向走
		if(tmp.free.length!=0) {
			
			var pos = getIdByDistance(tmp.free)

			delete robot.data[item]
			robot.data[pos] = item
			tool.createMsg('System','a robot has moved', 'text-info')

			config.moveAble = true
			robot.render()
			continue;
		}

		config.moveAble = false
		continue;

	}
	
}
// 删除robot
robot.delete = function(id) {
	delete robot.data[id]
	robot.render()
}

function getIdList(x, y) {
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
	// console.log(posArr, '-----');
	return posArr
}

// 返回 距离hero 距离最短的坐标
function getIdByDistance(ids) {
	
	var hero = {
		x : $('.hero').attr('id').split('_')[1],
		y : $('.hero').attr('id').split('_')[2]
	}

	var min = ids[0];

	pre = {
				x : ids[0].split('_')[1],
				y : ids[0].split('_')[2]
			}
	for (var i = 1; i < ids.length; i++) {
		var now = {
				x : ids[i].split('_')[1],
				y : ids[i].split('_')[2]
			}

		// pre <= now ? true:false
		if(!compare(pre, now, hero)) {
			min = ids[i]
			pre = now
		}
	}
	return min

}

function compare(p, n, hero) {
	var pd = Math.pow(Math.abs(p.x-hero.x),2) + Math.pow(Math.abs(p.y-hero.y), 2)
	var nd = Math.pow(Math.abs(n.x-hero.x),2) + Math.pow(Math.abs(n.y-hero.y), 2)

	console.log('robot,hero', pd, p, nd, n);
	return pd <= nd;
}

module.exports = robot