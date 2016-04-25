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
	control : [119, 87, 97, 65, 100, 68, 83 ,115]
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

			} else if(Object.keys(power.data) == 0 && attr.level == 0 || Object.keys(hero.data) == 0) {
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
	if(attr.level == 0) {
		$('.big').removeClass('big')
	} else {
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
	$('.msg').scrollTop($('.msg').height())
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2F0dHIuanMiLCJhcHAvc3JjL2NvbmZpZy5qcyIsImFwcC9zcmMvZXZlbnQuanMiLCJhcHAvc3JjL2hlcm8uanMiLCJhcHAvc3JjL21haW4uanMiLCJhcHAvc3JjL21hcC5qcyIsImFwcC9zcmMvb2JzdGFjbGUuanMiLCJhcHAvc3JjL3JvYm90LmpzIiwiYXBwL3NyYy9zZXR1cC5qcyIsImFwcC9zcmMvdG9vbC5qcyIsImFwcC9zcmMvdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgYXR0ciA9IHtcblx0c2NvcmUgOiAwLFxuXHRsZXZlbCA6IDEsXG5cdHJvdW5kIDogMVxufVxuXG5hdHRyLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcuU2NvcmUnKS5odG1sKGF0dHIuc2NvcmUpXG5cdCQoJy5sZXZlbCcpLmh0bWwoYXR0ci5sZXZlbClcblx0JCgnLnJvdW5kIHNwYW4nKS5odG1sKGF0dHIucm91bmQpXG59XG5cbmF0dHIuY2hhbmdlID0gZnVuY3Rpb24gKHR5cGUsIG51bSkge1xuXHRpZih0eXBlID09ICdyb3VuZCcpIHtcblx0XHRhdHRyLmxldmVsID0gYXR0ci5sZXZlbCA9PSAwPyAwOiAtLWF0dHIubGV2ZWxcblx0fVxuXHRhdHRyW3R5cGVdID0gYXR0clt0eXBlXS8xICsgbnVtLzFcblx0YXR0ci5yZW5kZXIoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF0dHIiLCJjb25zdCBjb25maWcgPSB7XG5cdG1hcFNpemUgOiB7XG5cdFx0eCA6IDEwLFxuXHRcdHkgOiAxMFxuXHR9LFxuXHRzdGFnZSA6ICdzdGFnZScsXG5cdHRvQXJyIDogWy0xLDAsMV0sXG5cdGNvbnRyb2wgOiBbMTE5LCA4NywgOTcsIDY1LCAxMDAsIDY4LCA4MyAsMTE1XVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZyIsInZhciBoZXJvID0gcmVxdWlyZSgnLi9oZXJvJylcbnZhciBzZXR1cCA9IHJlcXVpcmUoJy4vc2V0dXAnKVxudmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxudmFyIHRvb2wgPSByZXF1aXJlKCcuL3Rvb2wnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcblxudmFyIGV2ZW50ID0ge31cblxuLy8gdyxhLHMsZCBvciBXLEEsUyxEXG5ldmVudC5jcmVhdGUgPSBmdW5jdGlvbigpIHtcblx0JCh3aW5kb3cpLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpe1xuXHRcdGhlcm8ubW92ZVRvKGUud2hpY2gpXG5cdFx0cm9ib3QubW92ZVRvKClcblx0XHRpZihjb25maWcuY29udHJvbC5pbmRleE9mKGUud2hpY2gpICE9IC0xKSB7XG5cdFx0XHRpZihPYmplY3Qua2V5cyhyb2JvdC5kYXRhKSA9PSAwKSB7XG5cdFx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCAnaGVybyBiZWNvbWUgdGhlIHdpbm5lcicsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0YWxlcnQoJ3lvdSB3aW4hXFxuc2NvcmU6JyArIGF0dHIuc2NvcmUpXG5cblx0XHRcdH0gZWxzZSBpZihPYmplY3Qua2V5cyhwb3dlci5kYXRhKSA9PSAwICYmIGF0dHIubGV2ZWwgPT0gMCB8fCBPYmplY3Qua2V5cyhoZXJvLmRhdGEpID09IDApIHtcblx0XHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsJ2hlcm8gaXMga2lsbGVkLCBmYWlsZWQhIHNjb3JlOicgKyBhdHRyLnNjb3JlLCAndGV4dC1kYW5nZXInKVxuXHRcdFx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0XHRcdGFsZXJ0KCdmYWlsZWQhJylcblx0XHRcdH1cblx0XHRcdGF0dHIuY2hhbmdlKCdyb3VuZCcsIDEpXG5cdFx0fVxuXHR9KVxuXG5cdFxufVxuXG5cblxuZXZlbnQuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHQkKCcuc3RhcnQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRzZXR1cC5jYW5jZWwoKVxuXHRcdGV2ZW50LmNyZWF0ZSgpXG5cdFx0JCgnLnN0YXJ0Jykub2ZmKCdjbGljaycpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcblx0fSlcblx0JCgnLmVuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywgJ2dhbWUgb3ZlciEgc2NvcmUgOiAnICsgYXR0ci5zY29yZSwgJ3RleHQtZGFuZ2VyJylcblx0XHQkKCcuZW5kJykub2ZmKCdjbGljaycpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcblx0fSlcblx0JCgnLnJlc3RhcnQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnQiLCJ2YXIgcm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcbnZhciBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG5cbi8vIGhlcm9gcyBkYXRhXG5sZXQgZGF0YSA9IHtcblx0cG9zIDogbnVsbCxcblx0b2xkUG9zIDogbnVsbFxufVxuXG5sZXQgaGVybyA9IHt9XG5cbmhlcm8uZGF0YSA9IGRhdGFcblxuaGVyby5zZXQgPSBmdW5jdGlvbihpZCkge1xuXHRpZihoZXJvLmRhdGEub2xkUG9zICE9IG51bGwpIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRoZXJvLmRhdGEucG9zID0gaGVyby5kYXRhLm9sZFBvcyA9IGlkO1xuXHRoZXJvLnJlbmRlcigpXG5cdHJldHVybiB0cnVlXG59XG5cbi8vIHJlbmRlciBoZXJvXG5oZXJvLnJlbmRlciA9IGZ1bmN0aW9uICgpe1xuXHQkKCcjJyArIGhlcm8uZGF0YS5vbGRQb3MpLnJlbW92ZUNsYXNzKCdoZXJvJykuZW1wdHkoKVxuXHRpZihhdHRyLmxldmVsID09IDApIHtcblx0XHQkKCcuYmlnJykucmVtb3ZlQ2xhc3MoJ2JpZycpXG5cdH0gZWxzZSB7XG5cdFx0JCgnIycgKyBoZXJvLmRhdGEucG9zKS5hZGRDbGFzcygnYmlnJylcblx0fVxuXHRcblx0JCgnIycgKyBoZXJvLmRhdGEucG9zKS5hZGRDbGFzcygnaGVybycpLmh0bWwoJ0gnKVxufVxuXG5cbi8vIGNvbnRyb2wgaGVyb1xuaGVyby5tb3ZlVG8gPSBmdW5jdGlvbihhY3Rpb24pIHtcblx0dmFyIHBvcyA9IGhlcm8uZGF0YS5wb3Muc3BsaXQoJ18nKVxuXHRzd2l0Y2goYWN0aW9uKSB7XG5cdFx0Ly8gdXBcblx0XHRjYXNlIDExOTpcblxuXHRcdGNhc2UgODc6IFxuXHRcdFx0LS1wb3NbMl1cblx0XHRcdGJyZWFrO1xuXHRcdC8vIGxlZnRcblx0XHRjYXNlIDk3OlxuXHRcdGNhc2UgNjU6XG5cdFx0XHQtLXBvc1sxXVxuXHRcdFx0YnJlYWs7XG5cdFx0Ly8gcmlnaHRcblx0XHRjYXNlIDEwMDpcblx0XHRjYXNlIDY4OlxuXHRcdFx0Kytwb3NbMV1cblx0XHRcdGNvbnNvbGUud2Fybihwb3NbMV0pO1xuXHRcdFx0YnJlYWs7XG5cdFx0Ly8gZG93blxuXHRcdGNhc2UgODM6XG5cblx0XHRjYXNlIDExNTpcblx0XHRcdCsrcG9zWzJdXG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHZhciBuZXdQb3MgPSBwb3Muam9pbignXycpXG5cdGlmKCQoXCIjXCIgKyBuZXdQb3MpLmF0dHIoJ2NsYXNzJykpIHtcblx0XHRpZigkKFwiI1wiICsgbmV3UG9zKS5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoPT0xKXtcblx0XHRcdGhlcm8uZGF0YS5vbGRQb3MgPSBoZXJvLmRhdGEucG9zXG5cdFx0XHRoZXJvLmRhdGEucG9zID0gcG9zLmpvaW4oJ18nKVx0XG5cdFx0fSBlbHNlIGlmKCQoXCIjXCIgKyBuZXdQb3MpLmhhc0NsYXNzKCdyb2JvdCcpKSB7XG5cdFx0XHRpZihhdHRyLmxldmVsICE9IDApIHtcblx0XHRcdFx0cm9ib3QuZGVsZXRlKG5ld1Bvcylcblx0XHRcdFx0aGVyby5kYXRhLm9sZFBvcyA9IGhlcm8uZGF0YS5wb3Ncblx0XHRcdFx0aGVyby5kYXRhLnBvcyA9IHBvcy5qb2luKCdfJylcblx0XHRcdFx0YXR0ci5jaGFuZ2UoJ3Njb3JlJywgMTAwKVx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgnZmFpbGVkIScpXG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKCQoXCIjXCIgKyBuZXdQb3MpLmhhc0NsYXNzKCdwb3dlclVwJykpIHtcblx0XHRcdHZhciBsZXZlbCA9IHBvd2VyLmRhdGFbbmV3UG9zXVxuXHRcdFx0YXR0ci5jaGFuZ2UoJ2xldmVsJywgbGV2ZWwpXG5cdFx0XHRhdHRyLmNoYW5nZSgnc2NvcmUnLCBsZXZlbClcblx0XHRcdHBvd2VyLmRlbGV0ZShuZXdQb3MpXG5cdFx0XHRoZXJvLmRhdGEub2xkUG9zID0gaGVyby5kYXRhLnBvc1xuXHRcdFx0aGVyby5kYXRhLnBvcyA9IHBvcy5qb2luKCdfJylcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0YWxlcnQoJ+S9oOS4jeiDvei/meagt+enu+WKqO+8geWbnuWQiOe7k+adn++8gScpXG5cdH1cblx0aGVyby5yZW5kZXIoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhlcm9cblxuXG5cblxuIiwiLy8gbWFwIG1vZGFsXG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKVxuXG4vLyBoZXJvIG1vZGFsXG52YXIgaGVybyA9IHJlcXVpcmUoJy4vaGVybycpXG5cbi8vIGV2ZW50IG1vZGFsXG52YXIgZXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50JylcblxuLy8gb2JzdGFjbGUgbW9kYWxcbnZhciBvYnN0YWNsZSA9IHJlcXVpcmUoJy4vb2JzdGFjbGUnKVxuXG4vLyByb2JvdCBtb2RhbFxudmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG5cbi8vIHBvd2VyLXVwIG1vZGFsXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxuXG52YXIgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG5cblxudmFyIHNldHVwID0gcmVxdWlyZSgnLi9zZXR1cCcpXG5cbm1hcC5yZW5kZXIoKVxuXG5hdHRyLnJlbmRlcigpXG5cbi8qKlxuICogZ2FtZSBtYWluIGVudHJ5XG4gKi9cblxuc2V0dXAuYmluZCgpXG5cbmV2ZW50LmluaXQoKVxuXG5cbiIsInZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG5cbnZhciBtYXAgPSBuZXcgT2JqZWN0KClcbnZhciBkYXRhID0gbmV3IEFycmF5KClcblxuXG5cblxuZm9yICh2YXIgaSA9IDE7IGkgPD0gY29uZmlnLm1hcFNpemUueTsgaSsrKSB7XG5cdGxldCB0ZW1wID0gbmV3IEFycmF5KClcblx0Zm9yICh2YXIgaiA9IDE7IGogPD0gY29uZmlnLm1hcFNpemUueDsgaisrKSB7XG5cdFx0bGV0IG8gPSB7XG5cdFx0XHRpZCA6IFwiY2VsbFwiICsgXCJfXCIgKyBqICsgXCJfXCIgKyBpLFxuXHRcdFx0dHlwZSA6ICdyb2FkJ1xuXHRcdH1cblx0XHR0ZW1wLnB1c2gobylcblx0fVxuXHRkYXRhLnB1c2godGVtcClcbn1cblxubWFwLmRhdGEgPSBkYXRhXG5tYXAucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdGxldCBzdGFnZSA9ICQoJyMnICsgY29uZmlnLnN0YWdlKVxuXHRzdGFnZS5odG1sKCcnKVxuXHRmb3IgKHZhciBpID0gMTsgaSA8PSBjb25maWcubWFwU2l6ZS55OyBpKyspIHtcblx0XHRmb3IgKHZhciBqID0gMTsgaiA8PSBjb25maWcubWFwU2l6ZS54OyBqKyspIHtcblx0XHRcdGxldCBkYXRhID0gbWFwLmRhdGFbaS0xXVtqLTFdO1xuXG5cdFx0XHRsZXQgdGVtcENlbGwgPSBcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJjZWxsXCIgaWQ9XCInICsgZGF0YS5pZCArICdcIiBkYXRhLXJvbGU9XCInICsgZGF0YS50eXBlICsgJ1wiPicgK1xuXG5cdFx0XHRcdCc8L2Rpdj4nO1xuXHRcdFx0c3RhZ2UuYXBwZW5kKHRlbXBDZWxsKVxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwIiwidmFyIG9ic3RhY2xlID0ge31cbiBcbm9ic3RhY2xlLmRhdGEgPSBbXVxuXG5vYnN0YWNsZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0JCgnb2JzdGFjbGUnKS5yZW1vdmVDbGFzcygnb2JzdGFjbGUnKVxuXHRmb3IgKHZhciBpID0gb2JzdGFjbGUuZGF0YS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdCQoJyMnICsgb2JzdGFjbGUuZGF0YVtpXSkuYWRkQ2xhc3MoJ29ic3RhY2xlJylcblx0fVxufVxub2JzdGFjbGUuc2V0ID0gZnVuY3Rpb24oaWQpIHtcblx0aWYob2JzdGFjbGUuZGF0YS5pbmRleE9mKGlkKSA9PSAtMSkge1xuXHRcdG9ic3RhY2xlLmRhdGEucHVzaChpZClcblx0XHRvYnN0YWNsZS5yZW5kZXIoKVxuXHRcdHJldHVybiB0cnVlXG5cdH1cblx0cmV0dXJuIGZhbHNlXG5cdFxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBvYnN0YWNsZSIsInZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxudmFyIHRvb2wgPSByZXF1aXJlKCcuL3Rvb2wnKVxuXG52YXIgcm9ib3QgPSB7fVxuXG5cbnJvYm90LmRhdGEgPSB7fVxuXG5cbi8vIOiuvue9riByb2JvdOeahOWdkOagh1xucm9ib3Quc2V0ID0gZnVuY3Rpb24oaWQpIHtcblx0aWYocm9ib3QuZGF0YVtpZF0pIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXG5cdHJvYm90LmRhdGFbaWRdID0gaWRcblx0cm9ib3QucmVuZGVyKClcblx0cmV0dXJuIHRydWVcbn1cblxuLy8g5riy5p+TXG5yb2JvdC5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0JCgnLnJvYm90JykucmVtb3ZlQ2xhc3MoJ3JvYm90JykuZW1wdHkoKVxuXHRmb3IodmFyIGl0ZW0gaW4gcm9ib3QuZGF0YSkge1xuXHRcdCQoXCIjXCIgKyBpdGVtKS5hZGRDbGFzcygncm9ib3QnKS5odG1sKCdSJylcblx0fVxuXHRcbn1cblxuLy8g56e75YqoXG5yb2JvdC5tb3ZlVG8gPSBmdW5jdGlvbigpIHtcblx0XG5cblx0Zm9yKHZhciBpdGVtIGluIHJvYm90LmRhdGEpIHtcblx0XHR2YXIgcG9zID0gaXRlbS5zcGxpdCgnXycpXG5cdFx0dmFyIHRtcCA9IHtcblx0XHRcdHJvYm90IDogW10sXG5cdFx0XHRwb3dlciA6IFtdLFxuXHRcdFx0ZnJlZSA6IFtdLFxuXHRcdFx0aGVybyA6IFtdXG5cdFx0fVxuXHRcdHZhciBwb3NBcnIgPSBnZXRJZChwb3NbMV0sIHBvc1syXSlcblx0XHRmb3IodmFyIGk9MDsgaTxwb3NBcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBvYmogPSAkKFwiI1wiK3Bvc0FycltpXSlcblx0XHRcdGlmKG9iai5hdHRyKCdjbGFzcycpKSB7XG5cdFx0XHRcdGlmKG9iai5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0XHR0bXAuZnJlZS5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygncm9ib3QnKSkge1xuXHRcdFx0XHRcdHRtcC5yb2JvdC5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygncG93ZXJVcCcpKSB7XG5cdFx0XHRcdFx0dG1wLnBvd2VyLnB1c2gocG9zQXJyW2ldKVxuXHRcdFx0XHR9IGVsc2UgaWYob2JqLmhhc0NsYXNzKCdoZXJvJykpIHtcblx0XHRcdFx0XHR0bXAuaGVyby5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKHRtcC5oZXJvLmxlbmd0aCE9MCkge1xuXG5cdFx0XHRpZihhdHRyLmxldmVsICE9IDApIHtcblx0XHRcdFx0ZGVsZXRlIHJvYm90LmRhdGFbaXRlbV1cblx0XHRcdFx0YXR0ci5jaGFuZ2UoJ3Njb3JlJywgMTAwKVxuXHRcdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnaGVybyBraWxsIGEgcm9ib3Qsd2luIDEwMCBzY29yZScsICd0ZXh0LWluZm8nKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ2ZhaWxlZCEnKVxuXHRcdFx0XHR0b29sLmNyZWF0TXNnZSgnU3lzdGVtJywnaGVybyBpcyBraWxsZWQhIHNjb3JlOicgKyBhdHRyLnNjb3JlLCAndGV4dC1kYW5nZXInKVxuXHRcdFx0fVxuXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZih0bXAucG93ZXIubGVuZ3RoIT0wKSB7XG5cdFx0XHRwb3dlci5kZWxldGUodG1wLnBvd2VyWzBdKVxuXG5cdFx0XHR2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHRtcC5wb3dlci5sZW5ndGgpKVxuXHRcdFx0ZGVsZXRlIHJvYm90LmRhdGFbaXRlbV1cblx0XHRcdHJvYm90LmRhdGFbdG1wLnBvd2VyW2luZGV4XV0gPSBpdGVtXG5cdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywgJ2Egcm9ib3QgZGVzdG9yeSBhIHBvd2VyLXVwJywgJ3RleHQtaW5mbycpXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZih0bXAuZnJlZS5sZW5ndGghPTApIHtcblx0XHRcdHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoodG1wLmZyZWUubGVuZ3RoKSlcblx0XHRcdGRlbGV0ZSByb2JvdC5kYXRhW2l0ZW1dXG5cdFx0XHRyb2JvdC5kYXRhW3RtcC5mcmVlW2luZGV4XV0gPSBpdGVtXG5cdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnYSByb2JvdCBoYXMgbW92ZWQnLCAndGV4dC1pbmZvJylcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGNvbnRpbnVlO1xuXG5cdH1cblx0cm9ib3QucmVuZGVyKClcbn1cblxuLy8g5Yig6Zmkcm9ib3RcbnJvYm90LmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdGRlbGV0ZSByb2JvdC5kYXRhW2lkXVxuXHRyb2JvdC5yZW5kZXIoKVxufVxuXG5cbmZ1bmN0aW9uIGdldElkKHgsIHkpIHtcblx0dmFyIHRveCA9IHRveSA9IDBcblx0dmFyIHBvc0FyciA9IFtdXG5cdGZvciAodmFyIGk9MDsgaTwzOyBpKyspIHtcblx0XHRmb3IgKHZhciBqPTA7IGo8MzsgaisrKSB7XG5cdFx0XHRpZihpPT0wICYmIGk9PWopIGNvbnRpbnVlO1xuXHRcdFx0dmFyIHRtcF94ID0geC8xICsgY29uZmlnLnRvQXJyW2ldLFxuXHRcdFx0XHR0bXBfeSA9IHkvMSArIGNvbmZpZy50b0FycltqXVxuXG5cdFx0XHRwb3NBcnIucHVzaChcImNlbGxfXCIgKyB0bXBfeCArIFwiX1wiICsgdG1wX3kpXG5cdFx0fVxuXHR9XG5cdGNvbnNvbGUubG9nKHBvc0FyciwgJy0tLS0tJyk7XG5cdHJldHVybiBwb3NBcnJcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByb2JvdCIsInZhciBoZXJvID0gcmVxdWlyZSgnLi9oZXJvJylcbnZhciBvYnN0YWNsZSA9IHJlcXVpcmUoJy4vb2JzdGFjbGUnKVxudmFyIHBvd2VyID0gcmVxdWlyZSgnLi92JylcbnZhciByb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxuXG52YXIgc2V0dXAgPSB7fVxuXG4vLyDkuovku7bnu5HlrppcbnNldHVwLmJpbmQgPSBmdW5jdGlvbigpIHtcblx0JCgnI3N0YWdlJykub24oJ2NsaWNrJyxcIi5jZWxsXCIsZnVuY3Rpb24oZSkge1xuXHRcdHZhciByb2xlID0gcHJvbXB0KFwic2V0dXBcIilcblx0XHR2YXIgdGFyZ2V0ID0gJChlLnRhcmdldClcblx0XHRpbml0Q2VsbCh0YXJnZXQsIHJvbGUpXG5cdH0pXG59XG5cbi8vIOino+mZpOS6i+S7tue7keWumlxuc2V0dXAuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdCQoJyNzdGFnZScpLm9mZignY2xpY2snLCAnLmNlbGwnKVxufVxuZnVuY3Rpb24gaW5pdENlbGwodGFyZ2V0LCByb2xlKSB7XG5cdHN3aXRjaChyb2xlKSB7XG5cdFx0Y2FzZSBcIm9cIiA6XG5cdFx0Y2FzZSBcIk9cIiA6XG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxICYmIG9ic3RhY2xlLnNldCh0YXJnZXQuYXR0cignaWQnKSkpe1xuXHRcdFx0XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJoXCI6XG5cdFx0Y2FzZSBcIkhcIjpcblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRpZighaGVyby5zZXQodGFyZ2V0LmF0dHIoJ2lkJykpKSB7XG5cdFx0XHRcdFx0YWxlcnQoJ+WPquiDveaUvue9ruS4gOS4qmhlcm8hJylcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJcIjpcblx0XHRjYXNlIFwiUlwiOlxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSAmJiByb2JvdC5zZXQodGFyZ2V0LmF0dHIoJ2lkJykpKXtcblx0XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OiBcblxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdGlmKE51bWJlcihyb2xlKT49MSAmJiBOdW1iZXIocm9sZSk8PTkpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhyb2xlKTtcblx0XHRcdFx0XHRwb3dlci5zZXQodGFyZ2V0LmF0dHIoJ2lkJyksIHJvbGUpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YWxlcnQoJ+i+k+WFpeWRveS7pOaXoOaViCEnKVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFxuXHR9XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwIiwidmFyIHRvb2wgPSB7fVxuXG50b29sLmNyZWF0ZU1zZyA9IGZ1bmN0aW9uKHJvbGUsIG1zZywgY2xhc3NOYW1lKSB7XG5cdHZhciBodG1sID0gYFxuXHRcdDxwIGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+JHtyb2xlfSA6ICR7bXNnfTwvcD5cblx0YDtcblx0JCgnLm1zZycpLmFwcGVuZChodG1sKVxuXHQkKCcubXNnJykuc2Nyb2xsVG9wKCQoJy5tc2cnKS5oZWlnaHQoKSlcbn1cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB0b29sIiwidmFyIHBvd2VyID0ge31cblxucG93ZXIuZGF0YSA9IHt9XG5cbnBvd2VyLnNldCA9IGZ1bmN0aW9uKGlkLCByb2xlKSB7XG5cdGlmKHBvd2VyLmRhdGFbaWRdKSB7XG5cdFx0Y29uc29sZS5sb2coMzMzKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwb3dlci5kYXRhW2lkXSA9IHJvbGVcblx0cG93ZXIucmVuZGVyKClcblx0cmV0dXJuIHRydWU7XG59XG5cbnBvd2VyLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdCQoJyMnICsgaWQpLmVtcHR5KClcblx0ZGVsZXRlIHBvd2VyLmRhdGFbaWRdXG5cdHBvd2VyLnJlbmRlcigpXG59XG5cbnBvd2VyLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcucG93ZXJVcCcpLnJlbW92ZUNsYXNzKCdwb3dlclVwJykuZW1wdHkoKVxuXHRmb3IoIHZhciBpdGVtIGluIHBvd2VyLmRhdGEpIHtcblx0XHQkKFwiI1wiICsgaXRlbSkuYWRkQ2xhc3MoJ3Bvd2VyVXAnKS5odG1sKCdQXycgKyBwb3dlci5kYXRhW2l0ZW1dKVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcG93ZXIiXX0=
