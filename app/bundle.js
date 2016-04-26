(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
const config = {
	mapSize : {
		x : 10,
		y : 10
	},
	stage : 'stage',
	toArr : [-1,0,1],
	control : [119, 87, 97, 65, 100, 68, 83 ,115],
	moveAble : false
}

module.exports = config
},{}],3:[function(require,module,exports){
var hero = require('./hero')
var setup = require('./setup')
var robot = require('./robot')
var power = require('./v')
var attr = require('./attr')
var tool = require('./tool')
var config = require('./config')

var event = {}

// w,a,s,d or W,A,S,D
event.create = function() {
	$(window).on('keypress', function(e){
		hero.moveTo(e.which)
		robot.moveTo()
		if(config.control.indexOf(e.which) != -1) {
			if(Object.keys(robot.data) == 0) {
				tool.createMsg('System', 'hero become the winner', 'text-danger')
				$(window).off('keypress')
				alert('you win!\nscore:' + attr.score)

			} else if(Object.keys(power.data).length == 0 && attr.level == 0 || Object.keys(hero.data) == 0) {
				
				if(attr.level == 0 && !config.moveAble) {
					$(window).off('keypress')
					alert('平局')
					return;
				}
				tool.createMsg('System','hero is killed, failed! score:' + attr.score, 'text-danger')
				$(window).off('keypress')
				alert('failed!')


			} 
			attr.change('round', 1)
		}
	})

	
}



event.init = function() {
	$('.start').on('click', function() {
		setup.cancel()
		event.create()
		$('.start').off('click').prop('disabled', true)
	})
	$('.end').on('click', function() {
		$(window).off('keypress')
		tool.createMsg('System', 'game over! score : ' + attr.score, 'text-danger')
		$('.end').off('click').prop('disabled', true)
	})
	$('.restart').on('click', function() {
		window.location.reload();
	})
}

module.exports = event
},{"./attr":1,"./config":2,"./hero":4,"./robot":8,"./setup":9,"./tool":10,"./v":11}],4:[function(require,module,exports){
var robot = require('./robot')
var attr = require('./attr')
var power = require('./v')

// hero`s data
let data = {
	pos : null,
	oldPos : null
}

let hero = {}

hero.data = data

hero.set = function(id) {
	if(hero.data.oldPos != null) {
		return false
	}
	hero.data.pos = hero.data.oldPos = id;
	hero.render()
	return true
}

// render hero
hero.render = function (){
	$('#' + hero.data.oldPos).removeClass('hero').empty()
	$('.big').removeClass('big')
	if(attr.level != 0) {
		$('#' + hero.data.pos).addClass('big')
	}
	
	$('#' + hero.data.pos).addClass('hero').html('H')
}


// control hero
hero.moveTo = function(action) {
	var pos = hero.data.pos.split('_')
	switch(action) {
		// up
		case 119:

		case 87: 
			--pos[2]
			break;
		// left
		case 97:
		case 65:
			--pos[1]
			break;
		// right
		case 100:
		case 68:
			++pos[1]
			console.warn(pos[1]);
			break;
		// down
		case 83:

		case 115:
			++pos[2]
			break;
	}

	var newPos = pos.join('_')
	if($("#" + newPos).attr('class')) {
		if($("#" + newPos).attr('class').split(' ').length==1){
			hero.data.oldPos = hero.data.pos
			hero.data.pos = pos.join('_')	
		} else if($("#" + newPos).hasClass('robot')) {
			if(attr.level != 0) {
				robot.delete(newPos)
				hero.data.oldPos = hero.data.pos
				hero.data.pos = pos.join('_')
				attr.change('score', 100)	
			} else {
				alert('failed!')
			}
		} else if($("#" + newPos).hasClass('powerUp')) {
			var level = power.data[newPos]
			attr.change('level', level)
			attr.change('score', level)
			power.delete(newPos)
			hero.data.oldPos = hero.data.pos
			hero.data.pos = pos.join('_')
		}
	} else {
		alert('你不能这样移动！回合结束！')
	}
	console.info('hero', hero.data);
	hero.render()
}

module.exports = hero





},{"./attr":1,"./robot":8,"./v":11}],5:[function(require,module,exports){
// map modal
var map = require('./map')

// hero modal
var hero = require('./hero')

// event modal
var event = require('./event')

// obstacle modal
var obstacle = require('./obstacle')

// robot modal
var robot = require('./robot')

// power-up modal
var power = require('./v')

var attr = require('./attr')


var setup = require('./setup')

map.render()

attr.render()

/**
 * game main entry
 */

setup.bind()

event.init()



},{"./attr":1,"./event":3,"./hero":4,"./map":6,"./obstacle":7,"./robot":8,"./setup":9,"./v":11}],6:[function(require,module,exports){
var config = require('./config')

var map = new Object()
var data = new Array()




for (var i = 1; i <= config.mapSize.y; i++) {
	let temp = new Array()
	for (var j = 1; j <= config.mapSize.x; j++) {
		let o = {
			id : "cell" + "_" + j + "_" + i,
			type : 'road'
		}
		temp.push(o)
	}
	data.push(temp)
}

map.data = data
map.render = function() {
	let stage = $('#' + config.stage)
	stage.html('')
	for (var i = 1; i <= config.mapSize.y; i++) {
		for (var j = 1; j <= config.mapSize.x; j++) {
			let data = map.data[i-1][j-1];

			let tempCell = 
				'<div class="cell" id="' + data.id + '" data-role="' + data.type + '">' +

				'</div>';
			stage.append(tempCell)
			
		}
	}
}

module.exports = map
},{"./config":2}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
				tool.creatMsge('System','hero is killed! score:' + attr.score, 'text-danger')
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

	for (var i = 1; i < ids.length; i++) {
		var pre = {
				x : ids[i-1].split('_')[1],
				y : ids[i-1].split('_')[2]
			},
			now = {
				x : ids[i].split('_')[1],
				y : ids[i].split('_')[2]
			}

		// pre <= now ? true:false
		if(compare(pre, now, hero)) {
			min = ids[i-1]
		} else {
			min = ids[i]
		}
	}
	console.warn('robot', min, 'hero', hero);
	return min

}

function compare(p, n, hero) {
	console.info(hero);
	var pd = Math.pow(Math.abs(p.x-hero.x),2) + Math.pow(Math.abs(p.y-hero.y), 2)
	var nd = Math.pow(Math.abs(n.x-hero.x),2) + Math.pow(Math.abs(n.y-hero.y), 2)

	console.log('robot,hero', pd, p, nd, n);
	return pd <= nd ? true:false;
}

module.exports = robot
},{"./attr":1,"./config":2,"./tool":10,"./v":11}],9:[function(require,module,exports){
var hero = require('./hero')
var obstacle = require('./obstacle')
var power = require('./v')
var robot = require('./robot')

var setup = {}

// 事件绑定
setup.bind = function() {
	$('#stage').on('click',".cell",function(e) {
		var role = prompt("setup")
		var target = $(e.target)
		initCell(target, role)
	})
}

// 解除事件绑定
setup.cancel = function() {
	$('#stage').off('click', '.cell')
}
function initCell(target, role) {
	switch(role) {
		case "o" :
		case "O" :
			if(target.attr('class').split(' ').length == 1 && obstacle.set(target.attr('id'))){
				
			} else {
				alert('一个单元格只能有一个object!')
			}
			break;
		case "h":
		case "H":
			if(target.attr('class').split(' ').length == 1){
				if(!hero.set(target.attr('id'))) {
					alert('只能放置一个hero!')
				}
			} else {
				alert('一个单元格只能有一个object!')
			}
			break;
		case "r":
		case "R":
			if(target.attr('class').split(' ').length == 1 && robot.set(target.attr('id'))){
				
			} else {
				alert('一个单元格只能有一个object!')
			}
			break;
		default: 

			if(target.attr('class').split(' ').length == 1){
				if(Number(role)>=1 && Number(role)<=9) {
					console.log(role);
					power.set(target.attr('id'), role)
				} else {
					alert('输入命令无效!')
				}
			} else {
				alert('一个单元格只能有一个object!')
			}
	
	}
}



module.exports = setup
},{"./hero":4,"./obstacle":7,"./robot":8,"./v":11}],10:[function(require,module,exports){
var tool = {}

tool.createMsg = function(role, msg, className) {
	var html = `
		<p class="${className}">${role} : ${msg}</p>
	`;
	$('.msg').append(html)
	$('.msg').scrollTop($('.msg')[0].scrollHeight - $('.msg').height())
}




module.exports = tool
},{}],11:[function(require,module,exports){
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
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2F0dHIuanMiLCJhcHAvc3JjL2NvbmZpZy5qcyIsImFwcC9zcmMvZXZlbnQuanMiLCJhcHAvc3JjL2hlcm8uanMiLCJhcHAvc3JjL21haW4uanMiLCJhcHAvc3JjL21hcC5qcyIsImFwcC9zcmMvb2JzdGFjbGUuanMiLCJhcHAvc3JjL3JvYm90LmpzIiwiYXBwL3NyYy9zZXR1cC5qcyIsImFwcC9zcmMvdG9vbC5qcyIsImFwcC9zcmMvdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBhdHRyID0ge1xuXHRzY29yZSA6IDAsXG5cdGxldmVsIDogMSxcblx0cm91bmQgOiAxXG59XG5cbmF0dHIucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJy5TY29yZScpLmh0bWwoYXR0ci5zY29yZSlcblx0JCgnLmxldmVsJykuaHRtbChhdHRyLmxldmVsKVxuXHQkKCcucm91bmQgc3BhbicpLmh0bWwoYXR0ci5yb3VuZClcbn1cblxuYXR0ci5jaGFuZ2UgPSBmdW5jdGlvbiAodHlwZSwgbnVtKSB7XG5cdGlmKHR5cGUgPT0gJ3JvdW5kJykge1xuXHRcdGF0dHIubGV2ZWwgPSBhdHRyLmxldmVsID09IDA/IDA6IC0tYXR0ci5sZXZlbFxuXHR9XG5cdGF0dHJbdHlwZV0gPSBhdHRyW3R5cGVdLzEgKyBudW0vMVxuXHRhdHRyLnJlbmRlcigpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXR0ciIsImNvbnN0IGNvbmZpZyA9IHtcblx0bWFwU2l6ZSA6IHtcblx0XHR4IDogMTAsXG5cdFx0eSA6IDEwXG5cdH0sXG5cdHN0YWdlIDogJ3N0YWdlJyxcblx0dG9BcnIgOiBbLTEsMCwxXSxcblx0Y29udHJvbCA6IFsxMTksIDg3LCA5NywgNjUsIDEwMCwgNjgsIDgzICwxMTVdLFxuXHRtb3ZlQWJsZSA6IGZhbHNlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnIiwidmFyIGhlcm8gPSByZXF1aXJlKCcuL2hlcm8nKVxudmFyIHNldHVwID0gcmVxdWlyZSgnLi9zZXR1cCcpXG52YXIgcm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG52YXIgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG52YXIgdG9vbCA9IHJlcXVpcmUoJy4vdG9vbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxuXG52YXIgZXZlbnQgPSB7fVxuXG4vLyB3LGEscyxkIG9yIFcsQSxTLERcbmV2ZW50LmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuXHQkKHdpbmRvdykub24oJ2tleXByZXNzJywgZnVuY3Rpb24oZSl7XG5cdFx0aGVyby5tb3ZlVG8oZS53aGljaClcblx0XHRyb2JvdC5tb3ZlVG8oKVxuXHRcdGlmKGNvbmZpZy5jb250cm9sLmluZGV4T2YoZS53aGljaCkgIT0gLTEpIHtcblx0XHRcdGlmKE9iamVjdC5rZXlzKHJvYm90LmRhdGEpID09IDApIHtcblx0XHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsICdoZXJvIGJlY29tZSB0aGUgd2lubmVyJywgJ3RleHQtZGFuZ2VyJylcblx0XHRcdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdFx0XHRhbGVydCgneW91IHdpbiFcXG5zY29yZTonICsgYXR0ci5zY29yZSlcblxuXHRcdFx0fSBlbHNlIGlmKE9iamVjdC5rZXlzKHBvd2VyLmRhdGEpLmxlbmd0aCA9PSAwICYmIGF0dHIubGV2ZWwgPT0gMCB8fCBPYmplY3Qua2V5cyhoZXJvLmRhdGEpID09IDApIHtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKGF0dHIubGV2ZWwgPT0gMCAmJiAhY29uZmlnLm1vdmVBYmxlKSB7XG5cdFx0XHRcdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdFx0XHRcdGFsZXJ0KCflubPlsYAnKVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnaGVybyBpcyBraWxsZWQsIGZhaWxlZCEgc2NvcmU6JyArIGF0dHIuc2NvcmUsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0YWxlcnQoJ2ZhaWxlZCEnKVxuXG5cblx0XHRcdH0gXG5cdFx0XHRhdHRyLmNoYW5nZSgncm91bmQnLCAxKVxuXHRcdH1cblx0fSlcblxuXHRcbn1cblxuXG5cbmV2ZW50LmluaXQgPSBmdW5jdGlvbigpIHtcblx0JCgnLnN0YXJ0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0c2V0dXAuY2FuY2VsKClcblx0XHRldmVudC5jcmVhdGUoKVxuXHRcdCQoJy5zdGFydCcpLm9mZignY2xpY2snKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG5cdH0pXG5cdCQoJy5lbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsICdnYW1lIG92ZXIhIHNjb3JlIDogJyArIGF0dHIuc2NvcmUsICd0ZXh0LWRhbmdlcicpXG5cdFx0JCgnLmVuZCcpLm9mZignY2xpY2snKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG5cdH0pXG5cdCQoJy5yZXN0YXJ0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHR9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50IiwidmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxuXG4vLyBoZXJvYHMgZGF0YVxubGV0IGRhdGEgPSB7XG5cdHBvcyA6IG51bGwsXG5cdG9sZFBvcyA6IG51bGxcbn1cblxubGV0IGhlcm8gPSB7fVxuXG5oZXJvLmRhdGEgPSBkYXRhXG5cbmhlcm8uc2V0ID0gZnVuY3Rpb24oaWQpIHtcblx0aWYoaGVyby5kYXRhLm9sZFBvcyAhPSBudWxsKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblx0aGVyby5kYXRhLnBvcyA9IGhlcm8uZGF0YS5vbGRQb3MgPSBpZDtcblx0aGVyby5yZW5kZXIoKVxuXHRyZXR1cm4gdHJ1ZVxufVxuXG4vLyByZW5kZXIgaGVyb1xuaGVyby5yZW5kZXIgPSBmdW5jdGlvbiAoKXtcblx0JCgnIycgKyBoZXJvLmRhdGEub2xkUG9zKS5yZW1vdmVDbGFzcygnaGVybycpLmVtcHR5KClcblx0JCgnLmJpZycpLnJlbW92ZUNsYXNzKCdiaWcnKVxuXHRpZihhdHRyLmxldmVsICE9IDApIHtcblx0XHQkKCcjJyArIGhlcm8uZGF0YS5wb3MpLmFkZENsYXNzKCdiaWcnKVxuXHR9XG5cdFxuXHQkKCcjJyArIGhlcm8uZGF0YS5wb3MpLmFkZENsYXNzKCdoZXJvJykuaHRtbCgnSCcpXG59XG5cblxuLy8gY29udHJvbCBoZXJvXG5oZXJvLm1vdmVUbyA9IGZ1bmN0aW9uKGFjdGlvbikge1xuXHR2YXIgcG9zID0gaGVyby5kYXRhLnBvcy5zcGxpdCgnXycpXG5cdHN3aXRjaChhY3Rpb24pIHtcblx0XHQvLyB1cFxuXHRcdGNhc2UgMTE5OlxuXG5cdFx0Y2FzZSA4NzogXG5cdFx0XHQtLXBvc1syXVxuXHRcdFx0YnJlYWs7XG5cdFx0Ly8gbGVmdFxuXHRcdGNhc2UgOTc6XG5cdFx0Y2FzZSA2NTpcblx0XHRcdC0tcG9zWzFdXG5cdFx0XHRicmVhaztcblx0XHQvLyByaWdodFxuXHRcdGNhc2UgMTAwOlxuXHRcdGNhc2UgNjg6XG5cdFx0XHQrK3Bvc1sxXVxuXHRcdFx0Y29uc29sZS53YXJuKHBvc1sxXSk7XG5cdFx0XHRicmVhaztcblx0XHQvLyBkb3duXG5cdFx0Y2FzZSA4MzpcblxuXHRcdGNhc2UgMTE1OlxuXHRcdFx0Kytwb3NbMl1cblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0dmFyIG5ld1BvcyA9IHBvcy5qb2luKCdfJylcblx0aWYoJChcIiNcIiArIG5ld1BvcykuYXR0cignY2xhc3MnKSkge1xuXHRcdGlmKCQoXCIjXCIgKyBuZXdQb3MpLmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGg9PTEpe1xuXHRcdFx0aGVyby5kYXRhLm9sZFBvcyA9IGhlcm8uZGF0YS5wb3Ncblx0XHRcdGhlcm8uZGF0YS5wb3MgPSBwb3Muam9pbignXycpXHRcblx0XHR9IGVsc2UgaWYoJChcIiNcIiArIG5ld1BvcykuaGFzQ2xhc3MoJ3JvYm90JykpIHtcblx0XHRcdGlmKGF0dHIubGV2ZWwgIT0gMCkge1xuXHRcdFx0XHRyb2JvdC5kZWxldGUobmV3UG9zKVxuXHRcdFx0XHRoZXJvLmRhdGEub2xkUG9zID0gaGVyby5kYXRhLnBvc1xuXHRcdFx0XHRoZXJvLmRhdGEucG9zID0gcG9zLmpvaW4oJ18nKVxuXHRcdFx0XHRhdHRyLmNoYW5nZSgnc2NvcmUnLCAxMDApXHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCdmYWlsZWQhJylcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYoJChcIiNcIiArIG5ld1BvcykuaGFzQ2xhc3MoJ3Bvd2VyVXAnKSkge1xuXHRcdFx0dmFyIGxldmVsID0gcG93ZXIuZGF0YVtuZXdQb3NdXG5cdFx0XHRhdHRyLmNoYW5nZSgnbGV2ZWwnLCBsZXZlbClcblx0XHRcdGF0dHIuY2hhbmdlKCdzY29yZScsIGxldmVsKVxuXHRcdFx0cG93ZXIuZGVsZXRlKG5ld1Bvcylcblx0XHRcdGhlcm8uZGF0YS5vbGRQb3MgPSBoZXJvLmRhdGEucG9zXG5cdFx0XHRoZXJvLmRhdGEucG9zID0gcG9zLmpvaW4oJ18nKVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRhbGVydCgn5L2g5LiN6IO96L+Z5qC356e75Yqo77yB5Zue5ZCI57uT5p2f77yBJylcblx0fVxuXHRjb25zb2xlLmluZm8oJ2hlcm8nLCBoZXJvLmRhdGEpO1xuXHRoZXJvLnJlbmRlcigpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGVyb1xuXG5cblxuXG4iLCIvLyBtYXAgbW9kYWxcbnZhciBtYXAgPSByZXF1aXJlKCcuL21hcCcpXG5cbi8vIGhlcm8gbW9kYWxcbnZhciBoZXJvID0gcmVxdWlyZSgnLi9oZXJvJylcblxuLy8gZXZlbnQgbW9kYWxcbnZhciBldmVudCA9IHJlcXVpcmUoJy4vZXZlbnQnKVxuXG4vLyBvYnN0YWNsZSBtb2RhbFxudmFyIG9ic3RhY2xlID0gcmVxdWlyZSgnLi9vYnN0YWNsZScpXG5cbi8vIHJvYm90IG1vZGFsXG52YXIgcm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcblxuLy8gcG93ZXItdXAgbW9kYWxcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG5cbnZhciBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcblxuXG52YXIgc2V0dXAgPSByZXF1aXJlKCcuL3NldHVwJylcblxubWFwLnJlbmRlcigpXG5cbmF0dHIucmVuZGVyKClcblxuLyoqXG4gKiBnYW1lIG1haW4gZW50cnlcbiAqL1xuXG5zZXR1cC5iaW5kKClcblxuZXZlbnQuaW5pdCgpXG5cblxuIiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcblxudmFyIG1hcCA9IG5ldyBPYmplY3QoKVxudmFyIGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cblxuXG5mb3IgKHZhciBpID0gMTsgaSA8PSBjb25maWcubWFwU2l6ZS55OyBpKyspIHtcblx0bGV0IHRlbXAgPSBuZXcgQXJyYXkoKVxuXHRmb3IgKHZhciBqID0gMTsgaiA8PSBjb25maWcubWFwU2l6ZS54OyBqKyspIHtcblx0XHRsZXQgbyA9IHtcblx0XHRcdGlkIDogXCJjZWxsXCIgKyBcIl9cIiArIGogKyBcIl9cIiArIGksXG5cdFx0XHR0eXBlIDogJ3JvYWQnXG5cdFx0fVxuXHRcdHRlbXAucHVzaChvKVxuXHR9XG5cdGRhdGEucHVzaCh0ZW1wKVxufVxuXG5tYXAuZGF0YSA9IGRhdGFcbm1hcC5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0bGV0IHN0YWdlID0gJCgnIycgKyBjb25maWcuc3RhZ2UpXG5cdHN0YWdlLmh0bWwoJycpXG5cdGZvciAodmFyIGkgPSAxOyBpIDw9IGNvbmZpZy5tYXBTaXplLnk7IGkrKykge1xuXHRcdGZvciAodmFyIGogPSAxOyBqIDw9IGNvbmZpZy5tYXBTaXplLng7IGorKykge1xuXHRcdFx0bGV0IGRhdGEgPSBtYXAuZGF0YVtpLTFdW2otMV07XG5cblx0XHRcdGxldCB0ZW1wQ2VsbCA9IFxuXHRcdFx0XHQnPGRpdiBjbGFzcz1cImNlbGxcIiBpZD1cIicgKyBkYXRhLmlkICsgJ1wiIGRhdGEtcm9sZT1cIicgKyBkYXRhLnR5cGUgKyAnXCI+JyArXG5cblx0XHRcdFx0JzwvZGl2Pic7XG5cdFx0XHRzdGFnZS5hcHBlbmQodGVtcENlbGwpXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXAiLCJ2YXIgb2JzdGFjbGUgPSB7fVxuIFxub2JzdGFjbGUuZGF0YSA9IFtdXG5cbm9ic3RhY2xlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCdvYnN0YWNsZScpLnJlbW92ZUNsYXNzKCdvYnN0YWNsZScpXG5cdGZvciAodmFyIGkgPSBvYnN0YWNsZS5kYXRhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0JCgnIycgKyBvYnN0YWNsZS5kYXRhW2ldKS5hZGRDbGFzcygnb2JzdGFjbGUnKVxuXHR9XG59XG5vYnN0YWNsZS5zZXQgPSBmdW5jdGlvbihpZCkge1xuXHRpZihvYnN0YWNsZS5kYXRhLmluZGV4T2YoaWQpID09IC0xKSB7XG5cdFx0b2JzdGFjbGUuZGF0YS5wdXNoKGlkKVxuXHRcdG9ic3RhY2xlLnJlbmRlcigpXG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXHRyZXR1cm4gZmFsc2Vcblx0XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG9ic3RhY2xlIiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG52YXIgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG52YXIgdG9vbCA9IHJlcXVpcmUoJy4vdG9vbCcpXG5cbnZhciByb2JvdCA9IHt9XG5cblxucm9ib3QuZGF0YSA9IHt9XG5cblxuLy8g6K6+572uIHJvYm9055qE5Z2Q5qCHXG5yb2JvdC5zZXQgPSBmdW5jdGlvbihpZCkge1xuXHRpZihyb2JvdC5kYXRhW2lkXSkge1xuXHRcdHJldHVybiBmYWxzZVxuXHR9XG5cblx0cm9ib3QuZGF0YVtpZF0gPSBpZFxuXHRyb2JvdC5yZW5kZXIoKVxuXHRyZXR1cm4gdHJ1ZVxufVxuXG4vLyDmuLLmn5NcbnJvYm90LnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcucm9ib3QnKS5yZW1vdmVDbGFzcygncm9ib3QnKS5lbXB0eSgpXG5cdGZvcih2YXIgaXRlbSBpbiByb2JvdC5kYXRhKSB7XG5cdFx0JChcIiNcIiArIGl0ZW0pLmFkZENsYXNzKCdyb2JvdCcpLmh0bWwoJ1InKVxuXHR9XG5cdGNvbnNvbGUuaW5mbyhyb2JvdC5kYXRhKTtcblx0XG59XG5cbi8vIOenu+WKqFxucm9ib3QubW92ZVRvID0gZnVuY3Rpb24oKSB7XG5cblxuXHRmb3IodmFyIGl0ZW0gaW4gcm9ib3QuZGF0YSkge1xuXHRcdHZhciBwb3MgPSBpdGVtLnNwbGl0KCdfJylcblx0XHR2YXIgdG1wID0ge1xuXHRcdFx0cm9ib3QgOiBbXSxcblx0XHRcdHBvd2VyIDogW10sXG5cdFx0XHRmcmVlIDogW10sXG5cdFx0XHRoZXJvIDogW11cblx0XHR9XG5cdFx0dmFyIHBvc0FyciA9IGdldElkTGlzdChwb3NbMV0sIHBvc1syXSlcblx0XHRmb3IodmFyIGk9MDsgaTxwb3NBcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBvYmogPSAkKFwiI1wiK3Bvc0FycltpXSlcblx0XHRcdGlmKG9iai5hdHRyKCdjbGFzcycpKSB7XG5cdFx0XHRcdGlmKG9iai5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0XHR0bXAuZnJlZS5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygncm9ib3QnKSkge1xuXHRcdFx0XHRcdHRtcC5yb2JvdC5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygncG93ZXJVcCcpKSB7XG5cdFx0XHRcdFx0dG1wLnBvd2VyLnB1c2gocG9zQXJyW2ldKVxuXHRcdFx0XHR9IGVsc2UgaWYob2JqLmhhc0NsYXNzKCdoZXJvJykpIHtcblx0XHRcdFx0XHR0bXAuaGVyby5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIOiLpemZhOi/keaciWhlcm/vvIzliJnkvJjlhYhoZXJvXG5cdFx0aWYodG1wLmhlcm8ubGVuZ3RoIT0wKSB7XG5cblx0XHRcdGlmKGF0dHIubGV2ZWwgIT0gMCkge1xuXHRcdFx0XHRkZWxldGUgcm9ib3QuZGF0YVtpdGVtXVxuXHRcdFx0XHRhdHRyLmNoYW5nZSgnc2NvcmUnLCAxMDApXG5cdFx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCdoZXJvIGtpbGwgYSByb2JvdCx3aW4gMTAwIHNjb3JlJywgJ3RleHQtaW5mbycpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgnZmFpbGVkIScpXG5cdFx0XHRcdHRvb2wuY3JlYXRNc2dlKCdTeXN0ZW0nLCdoZXJvIGlzIGtpbGxlZCEgc2NvcmU6JyArIGF0dHIuc2NvcmUsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHR9XG5cdFx0XHRjb25maWcubW92ZUFibGUgPSB0cnVlXG5cdFx0XHRyb2JvdC5yZW5kZXIoKVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8g6Iul6ZmE6L+R5rKh5pyJaGVyb+S9huaYr+aciSBwb3dlci11cCDliJnkvJjlhYjmkafmr4Fwb3dlci11cFxuXHRcdGlmKHRtcC5wb3dlci5sZW5ndGghPTApIHtcblx0XHRcdFxuXG5cdFx0XHR2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHRtcC5wb3dlci5sZW5ndGgpKVxuXHRcdFx0cG93ZXIuZGVsZXRlKHRtcC5wb3dlclswXSlcblx0XHRcdGRlbGV0ZSByb2JvdC5kYXRhW2l0ZW1dXG5cdFx0XHRyb2JvdC5kYXRhW3RtcC5wb3dlcltpbmRleF1dID0gaXRlbVxuXHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsICdhIHJvYm90IGRlc3RvcnkgYSBwb3dlci11cCcsICd0ZXh0LWluZm8nKVxuXHRcdFx0Y29uZmlnLm1vdmVBYmxlID0gdHJ1ZVxuXHRcdFx0cm9ib3QucmVuZGVyKClcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIOiLpeWRqOWbtOayoeaciWhlcm/kuZ/msqHmnIlwb3dlci11cCAg5YiZ5ZCR6Z2g6L+RaGVyb+eahOaWueWQkei1sFxuXHRcdGlmKHRtcC5mcmVlLmxlbmd0aCE9MCkge1xuXHRcdFx0XG5cdFx0XHR2YXIgcG9zID0gZ2V0SWRCeURpc3RhbmNlKHRtcC5mcmVlKVxuXG5cdFx0XHRkZWxldGUgcm9ib3QuZGF0YVtpdGVtXVxuXHRcdFx0cm9ib3QuZGF0YVtwb3NdID0gaXRlbVxuXHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsJ2Egcm9ib3QgaGFzIG1vdmVkJywgJ3RleHQtaW5mbycpXG5cblx0XHRcdGNvbmZpZy5tb3ZlQWJsZSA9IHRydWVcblx0XHRcdHJvYm90LnJlbmRlcigpXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRjb25maWcubW92ZUFibGUgPSBmYWxzZVxuXHRcdGNvbnRpbnVlO1xuXG5cdH1cblx0XG59XG5cbi8vIOWIoOmZpHJvYm90XG5yb2JvdC5kZWxldGUgPSBmdW5jdGlvbihpZCkge1xuXHRkZWxldGUgcm9ib3QuZGF0YVtpZF1cblx0cm9ib3QucmVuZGVyKClcbn1cblxuXG5mdW5jdGlvbiBnZXRJZExpc3QoeCwgeSkge1xuXHR2YXIgdG94ID0gdG95ID0gMFxuXHR2YXIgcG9zQXJyID0gW11cblx0Zm9yICh2YXIgaT0wOyBpPDM7IGkrKykge1xuXHRcdGZvciAodmFyIGo9MDsgajwzOyBqKyspIHtcblx0XHRcdGlmKGk9PTAgJiYgaT09aikgY29udGludWU7XG5cdFx0XHR2YXIgdG1wX3ggPSB4LzEgKyBjb25maWcudG9BcnJbaV0sXG5cdFx0XHRcdHRtcF95ID0geS8xICsgY29uZmlnLnRvQXJyW2pdXG5cblx0XHRcdHBvc0Fyci5wdXNoKFwiY2VsbF9cIiArIHRtcF94ICsgXCJfXCIgKyB0bXBfeSlcblx0XHR9XG5cdH1cblx0Ly8gY29uc29sZS5sb2cocG9zQXJyLCAnLS0tLS0nKTtcblx0cmV0dXJuIHBvc0FyclxufVxuXG4vLyDov5Tlm54g6Led56a7aGVybyDot53nprvmnIDnn63nmoTlnZDmoIdcbmZ1bmN0aW9uIGdldElkQnlEaXN0YW5jZShpZHMpIHtcblx0XG5cdHZhciBoZXJvID0ge1xuXHRcdHggOiAkKCcuaGVybycpLmF0dHIoJ2lkJykuc3BsaXQoJ18nKVsxXSxcblx0XHR5IDogJCgnLmhlcm8nKS5hdHRyKCdpZCcpLnNwbGl0KCdfJylbMl1cblx0fVxuXG5cdHZhciBtaW4gPSBpZHNbMF07XG5cblx0Zm9yICh2YXIgaSA9IDE7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgcHJlID0ge1xuXHRcdFx0XHR4IDogaWRzW2ktMV0uc3BsaXQoJ18nKVsxXSxcblx0XHRcdFx0eSA6IGlkc1tpLTFdLnNwbGl0KCdfJylbMl1cblx0XHRcdH0sXG5cdFx0XHRub3cgPSB7XG5cdFx0XHRcdHggOiBpZHNbaV0uc3BsaXQoJ18nKVsxXSxcblx0XHRcdFx0eSA6IGlkc1tpXS5zcGxpdCgnXycpWzJdXG5cdFx0XHR9XG5cblx0XHQvLyBwcmUgPD0gbm93ID8gdHJ1ZTpmYWxzZVxuXHRcdGlmKGNvbXBhcmUocHJlLCBub3csIGhlcm8pKSB7XG5cdFx0XHRtaW4gPSBpZHNbaS0xXVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtaW4gPSBpZHNbaV1cblx0XHR9XG5cdH1cblx0Y29uc29sZS53YXJuKCdyb2JvdCcsIG1pbiwgJ2hlcm8nLCBoZXJvKTtcblx0cmV0dXJuIG1pblxuXG59XG5cbmZ1bmN0aW9uIGNvbXBhcmUocCwgbiwgaGVybykge1xuXHRjb25zb2xlLmluZm8oaGVybyk7XG5cdHZhciBwZCA9IE1hdGgucG93KE1hdGguYWJzKHAueC1oZXJvLngpLDIpICsgTWF0aC5wb3coTWF0aC5hYnMocC55LWhlcm8ueSksIDIpXG5cdHZhciBuZCA9IE1hdGgucG93KE1hdGguYWJzKG4ueC1oZXJvLngpLDIpICsgTWF0aC5wb3coTWF0aC5hYnMobi55LWhlcm8ueSksIDIpXG5cblx0Y29uc29sZS5sb2coJ3JvYm90LGhlcm8nLCBwZCwgcCwgbmQsIG4pO1xuXHRyZXR1cm4gcGQgPD0gbmQgPyB0cnVlOmZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJvYm90IiwidmFyIGhlcm8gPSByZXF1aXJlKCcuL2hlcm8nKVxudmFyIG9ic3RhY2xlID0gcmVxdWlyZSgnLi9vYnN0YWNsZScpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxudmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG5cbnZhciBzZXR1cCA9IHt9XG5cbi8vIOS6i+S7tue7keWumlxuc2V0dXAuYmluZCA9IGZ1bmN0aW9uKCkge1xuXHQkKCcjc3RhZ2UnKS5vbignY2xpY2snLFwiLmNlbGxcIixmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHJvbGUgPSBwcm9tcHQoXCJzZXR1cFwiKVxuXHRcdHZhciB0YXJnZXQgPSAkKGUudGFyZ2V0KVxuXHRcdGluaXRDZWxsKHRhcmdldCwgcm9sZSlcblx0fSlcbn1cblxuLy8g6Kej6Zmk5LqL5Lu257uR5a6aXG5zZXR1cC5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0JCgnI3N0YWdlJykub2ZmKCdjbGljaycsICcuY2VsbCcpXG59XG5mdW5jdGlvbiBpbml0Q2VsbCh0YXJnZXQsIHJvbGUpIHtcblx0c3dpdGNoKHJvbGUpIHtcblx0XHRjYXNlIFwib1wiIDpcblx0XHRjYXNlIFwiT1wiIDpcblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEgJiYgb2JzdGFjbGUuc2V0KHRhcmdldC5hdHRyKCdpZCcpKSl7XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcImhcIjpcblx0XHRjYXNlIFwiSFwiOlxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdGlmKCFoZXJvLnNldCh0YXJnZXQuYXR0cignaWQnKSkpIHtcblx0XHRcdFx0XHRhbGVydCgn5Y+q6IO95pS+572u5LiA5LiqaGVybyEnKVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiclwiOlxuXHRcdGNhc2UgXCJSXCI6XG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxICYmIHJvYm90LnNldCh0YXJnZXQuYXR0cignaWQnKSkpe1xuXHRcdFx0XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6IFxuXG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0aWYoTnVtYmVyKHJvbGUpPj0xICYmIE51bWJlcihyb2xlKTw9OSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJvbGUpO1xuXHRcdFx0XHRcdHBvd2VyLnNldCh0YXJnZXQuYXR0cignaWQnKSwgcm9sZSlcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhbGVydCgn6L6T5YWl5ZG95Luk5peg5pWIIScpXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XG5cdH1cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dXAiLCJ2YXIgdG9vbCA9IHt9XG5cbnRvb2wuY3JlYXRlTXNnID0gZnVuY3Rpb24ocm9sZSwgbXNnLCBjbGFzc05hbWUpIHtcblx0dmFyIGh0bWwgPSBgXG5cdFx0PHAgY2xhc3M9XCIke2NsYXNzTmFtZX1cIj4ke3JvbGV9IDogJHttc2d9PC9wPlxuXHRgO1xuXHQkKCcubXNnJykuYXBwZW5kKGh0bWwpXG5cdCQoJy5tc2cnKS5zY3JvbGxUb3AoJCgnLm1zZycpWzBdLnNjcm9sbEhlaWdodCAtICQoJy5tc2cnKS5oZWlnaHQoKSlcbn1cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB0b29sIiwidmFyIHBvd2VyID0ge31cblxucG93ZXIuZGF0YSA9IHt9XG5cbnBvd2VyLnNldCA9IGZ1bmN0aW9uKGlkLCByb2xlKSB7XG5cdGlmKHBvd2VyLmRhdGFbaWRdKSB7XG5cdFx0Y29uc29sZS5sb2coMzMzKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwb3dlci5kYXRhW2lkXSA9IHJvbGVcblx0cG93ZXIucmVuZGVyKClcblx0cmV0dXJuIHRydWU7XG59XG5cbnBvd2VyLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdCQoJyMnICsgaWQpLmVtcHR5KClcblx0ZGVsZXRlIHBvd2VyLmRhdGFbaWRdXG5cdHBvd2VyLnJlbmRlcigpXG59XG5cbnBvd2VyLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcucG93ZXJVcCcpLnJlbW92ZUNsYXNzKCdwb3dlclVwJykuZW1wdHkoKVxuXHRmb3IoIHZhciBpdGVtIGluIHBvd2VyLmRhdGEpIHtcblx0XHQkKFwiI1wiICsgaXRlbSkuYWRkQ2xhc3MoJ3Bvd2VyVXAnKS5odG1sKCdQXycgKyBwb3dlci5kYXRhW2l0ZW1dKVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcG93ZXIiXX0=
