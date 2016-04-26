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

			robot.render()
			continue;
		}

		// 若周围没有hero也没有power-up  则向靠近hero的方向走
		if(tmp.free.length!=0) {
			
			var pos = getIdByDistance(tmp.free)

			delete robot.data[item]
			robot.data[pos] = item
			tool.createMsg('System','a robot has moved', 'text-info')

			robot.render()
			continue;
		}


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2F0dHIuanMiLCJhcHAvc3JjL2NvbmZpZy5qcyIsImFwcC9zcmMvZXZlbnQuanMiLCJhcHAvc3JjL2hlcm8uanMiLCJhcHAvc3JjL21haW4uanMiLCJhcHAvc3JjL21hcC5qcyIsImFwcC9zcmMvb2JzdGFjbGUuanMiLCJhcHAvc3JjL3JvYm90LmpzIiwiYXBwL3NyYy9zZXR1cC5qcyIsImFwcC9zcmMvdG9vbC5qcyIsImFwcC9zcmMvdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgYXR0ciA9IHtcblx0c2NvcmUgOiAwLFxuXHRsZXZlbCA6IDEsXG5cdHJvdW5kIDogMVxufVxuXG5hdHRyLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcuU2NvcmUnKS5odG1sKGF0dHIuc2NvcmUpXG5cdCQoJy5sZXZlbCcpLmh0bWwoYXR0ci5sZXZlbClcblx0JCgnLnJvdW5kIHNwYW4nKS5odG1sKGF0dHIucm91bmQpXG59XG5cbmF0dHIuY2hhbmdlID0gZnVuY3Rpb24gKHR5cGUsIG51bSkge1xuXHRpZih0eXBlID09ICdyb3VuZCcpIHtcblx0XHRhdHRyLmxldmVsID0gYXR0ci5sZXZlbCA9PSAwPyAwOiAtLWF0dHIubGV2ZWxcblx0fVxuXHRhdHRyW3R5cGVdID0gYXR0clt0eXBlXS8xICsgbnVtLzFcblx0YXR0ci5yZW5kZXIoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF0dHIiLCJjb25zdCBjb25maWcgPSB7XG5cdG1hcFNpemUgOiB7XG5cdFx0eCA6IDEwLFxuXHRcdHkgOiAxMFxuXHR9LFxuXHRzdGFnZSA6ICdzdGFnZScsXG5cdHRvQXJyIDogWy0xLDAsMV0sXG5cdGNvbnRyb2wgOiBbMTE5LCA4NywgOTcsIDY1LCAxMDAsIDY4LCA4MyAsMTE1XVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZyIsInZhciBoZXJvID0gcmVxdWlyZSgnLi9oZXJvJylcbnZhciBzZXR1cCA9IHJlcXVpcmUoJy4vc2V0dXAnKVxudmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxudmFyIHRvb2wgPSByZXF1aXJlKCcuL3Rvb2wnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcblxudmFyIGV2ZW50ID0ge31cblxuLy8gdyxhLHMsZCBvciBXLEEsUyxEXG5ldmVudC5jcmVhdGUgPSBmdW5jdGlvbigpIHtcblx0JCh3aW5kb3cpLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpe1xuXHRcdGhlcm8ubW92ZVRvKGUud2hpY2gpXG5cdFx0cm9ib3QubW92ZVRvKClcblx0XHRpZihjb25maWcuY29udHJvbC5pbmRleE9mKGUud2hpY2gpICE9IC0xKSB7XG5cdFx0XHRpZihPYmplY3Qua2V5cyhyb2JvdC5kYXRhKSA9PSAwKSB7XG5cdFx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCAnaGVybyBiZWNvbWUgdGhlIHdpbm5lcicsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0YWxlcnQoJ3lvdSB3aW4hXFxuc2NvcmU6JyArIGF0dHIuc2NvcmUpXG5cblx0XHRcdH0gZWxzZSBpZihPYmplY3Qua2V5cyhwb3dlci5kYXRhKSA9PSAwICYmIGF0dHIubGV2ZWwgPT0gMCB8fCBPYmplY3Qua2V5cyhoZXJvLmRhdGEpID09IDApIHtcblx0XHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsJ2hlcm8gaXMga2lsbGVkLCBmYWlsZWQhIHNjb3JlOicgKyBhdHRyLnNjb3JlLCAndGV4dC1kYW5nZXInKVxuXHRcdFx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0XHRcdGFsZXJ0KCdmYWlsZWQhJylcblx0XHRcdH1cblx0XHRcdGF0dHIuY2hhbmdlKCdyb3VuZCcsIDEpXG5cdFx0fVxuXHR9KVxuXG5cdFxufVxuXG5cblxuZXZlbnQuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHQkKCcuc3RhcnQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRzZXR1cC5jYW5jZWwoKVxuXHRcdGV2ZW50LmNyZWF0ZSgpXG5cdFx0JCgnLnN0YXJ0Jykub2ZmKCdjbGljaycpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcblx0fSlcblx0JCgnLmVuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywgJ2dhbWUgb3ZlciEgc2NvcmUgOiAnICsgYXR0ci5zY29yZSwgJ3RleHQtZGFuZ2VyJylcblx0XHQkKCcuZW5kJykub2ZmKCdjbGljaycpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcblx0fSlcblx0JCgnLnJlc3RhcnQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnQiLCJ2YXIgcm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcbnZhciBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG5cbi8vIGhlcm9gcyBkYXRhXG5sZXQgZGF0YSA9IHtcblx0cG9zIDogbnVsbCxcblx0b2xkUG9zIDogbnVsbFxufVxuXG5sZXQgaGVybyA9IHt9XG5cbmhlcm8uZGF0YSA9IGRhdGFcblxuaGVyby5zZXQgPSBmdW5jdGlvbihpZCkge1xuXHRpZihoZXJvLmRhdGEub2xkUG9zICE9IG51bGwpIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRoZXJvLmRhdGEucG9zID0gaGVyby5kYXRhLm9sZFBvcyA9IGlkO1xuXHRoZXJvLnJlbmRlcigpXG5cdHJldHVybiB0cnVlXG59XG5cbi8vIHJlbmRlciBoZXJvXG5oZXJvLnJlbmRlciA9IGZ1bmN0aW9uICgpe1xuXHQkKCcjJyArIGhlcm8uZGF0YS5vbGRQb3MpLnJlbW92ZUNsYXNzKCdoZXJvJykuZW1wdHkoKVxuXHQkKCcuYmlnJykucmVtb3ZlQ2xhc3MoJ2JpZycpXG5cdGlmKGF0dHIubGV2ZWwgIT0gMCkge1xuXHRcdCQoJyMnICsgaGVyby5kYXRhLnBvcykuYWRkQ2xhc3MoJ2JpZycpXG5cdH1cblx0XG5cdCQoJyMnICsgaGVyby5kYXRhLnBvcykuYWRkQ2xhc3MoJ2hlcm8nKS5odG1sKCdIJylcbn1cblxuXG4vLyBjb250cm9sIGhlcm9cbmhlcm8ubW92ZVRvID0gZnVuY3Rpb24oYWN0aW9uKSB7XG5cdHZhciBwb3MgPSBoZXJvLmRhdGEucG9zLnNwbGl0KCdfJylcblx0c3dpdGNoKGFjdGlvbikge1xuXHRcdC8vIHVwXG5cdFx0Y2FzZSAxMTk6XG5cblx0XHRjYXNlIDg3OiBcblx0XHRcdC0tcG9zWzJdXG5cdFx0XHRicmVhaztcblx0XHQvLyBsZWZ0XG5cdFx0Y2FzZSA5Nzpcblx0XHRjYXNlIDY1OlxuXHRcdFx0LS1wb3NbMV1cblx0XHRcdGJyZWFrO1xuXHRcdC8vIHJpZ2h0XG5cdFx0Y2FzZSAxMDA6XG5cdFx0Y2FzZSA2ODpcblx0XHRcdCsrcG9zWzFdXG5cdFx0XHRjb25zb2xlLndhcm4ocG9zWzFdKTtcblx0XHRcdGJyZWFrO1xuXHRcdC8vIGRvd25cblx0XHRjYXNlIDgzOlxuXG5cdFx0Y2FzZSAxMTU6XG5cdFx0XHQrK3Bvc1syXVxuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHR2YXIgbmV3UG9zID0gcG9zLmpvaW4oJ18nKVxuXHRpZigkKFwiI1wiICsgbmV3UG9zKS5hdHRyKCdjbGFzcycpKSB7XG5cdFx0aWYoJChcIiNcIiArIG5ld1BvcykuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aD09MSl7XG5cdFx0XHRoZXJvLmRhdGEub2xkUG9zID0gaGVyby5kYXRhLnBvc1xuXHRcdFx0aGVyby5kYXRhLnBvcyA9IHBvcy5qb2luKCdfJylcdFxuXHRcdH0gZWxzZSBpZigkKFwiI1wiICsgbmV3UG9zKS5oYXNDbGFzcygncm9ib3QnKSkge1xuXHRcdFx0aWYoYXR0ci5sZXZlbCAhPSAwKSB7XG5cdFx0XHRcdHJvYm90LmRlbGV0ZShuZXdQb3MpXG5cdFx0XHRcdGhlcm8uZGF0YS5vbGRQb3MgPSBoZXJvLmRhdGEucG9zXG5cdFx0XHRcdGhlcm8uZGF0YS5wb3MgPSBwb3Muam9pbignXycpXG5cdFx0XHRcdGF0dHIuY2hhbmdlKCdzY29yZScsIDEwMClcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ2ZhaWxlZCEnKVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZigkKFwiI1wiICsgbmV3UG9zKS5oYXNDbGFzcygncG93ZXJVcCcpKSB7XG5cdFx0XHR2YXIgbGV2ZWwgPSBwb3dlci5kYXRhW25ld1Bvc11cblx0XHRcdGF0dHIuY2hhbmdlKCdsZXZlbCcsIGxldmVsKVxuXHRcdFx0YXR0ci5jaGFuZ2UoJ3Njb3JlJywgbGV2ZWwpXG5cdFx0XHRwb3dlci5kZWxldGUobmV3UG9zKVxuXHRcdFx0aGVyby5kYXRhLm9sZFBvcyA9IGhlcm8uZGF0YS5wb3Ncblx0XHRcdGhlcm8uZGF0YS5wb3MgPSBwb3Muam9pbignXycpXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGFsZXJ0KCfkvaDkuI3og73ov5nmoLfnp7vliqjvvIHlm57lkIjnu5PmnZ/vvIEnKVxuXHR9XG5cdGNvbnNvbGUuaW5mbygnaGVybycsIGhlcm8uZGF0YSk7XG5cdGhlcm8ucmVuZGVyKClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZXJvXG5cblxuXG5cbiIsIi8vIG1hcCBtb2RhbFxudmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwJylcblxuLy8gaGVybyBtb2RhbFxudmFyIGhlcm8gPSByZXF1aXJlKCcuL2hlcm8nKVxuXG4vLyBldmVudCBtb2RhbFxudmFyIGV2ZW50ID0gcmVxdWlyZSgnLi9ldmVudCcpXG5cbi8vIG9ic3RhY2xlIG1vZGFsXG52YXIgb2JzdGFjbGUgPSByZXF1aXJlKCcuL29ic3RhY2xlJylcblxuLy8gcm9ib3QgbW9kYWxcbnZhciByb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxuXG4vLyBwb3dlci11cCBtb2RhbFxudmFyIHBvd2VyID0gcmVxdWlyZSgnLi92JylcblxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxuXG5cbnZhciBzZXR1cCA9IHJlcXVpcmUoJy4vc2V0dXAnKVxuXG5tYXAucmVuZGVyKClcblxuYXR0ci5yZW5kZXIoKVxuXG4vKipcbiAqIGdhbWUgbWFpbiBlbnRyeVxuICovXG5cbnNldHVwLmJpbmQoKVxuXG5ldmVudC5pbml0KClcblxuXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxuXG52YXIgbWFwID0gbmV3IE9iamVjdCgpXG52YXIgZGF0YSA9IG5ldyBBcnJheSgpXG5cblxuXG5cbmZvciAodmFyIGkgPSAxOyBpIDw9IGNvbmZpZy5tYXBTaXplLnk7IGkrKykge1xuXHRsZXQgdGVtcCA9IG5ldyBBcnJheSgpXG5cdGZvciAodmFyIGogPSAxOyBqIDw9IGNvbmZpZy5tYXBTaXplLng7IGorKykge1xuXHRcdGxldCBvID0ge1xuXHRcdFx0aWQgOiBcImNlbGxcIiArIFwiX1wiICsgaiArIFwiX1wiICsgaSxcblx0XHRcdHR5cGUgOiAncm9hZCdcblx0XHR9XG5cdFx0dGVtcC5wdXNoKG8pXG5cdH1cblx0ZGF0YS5wdXNoKHRlbXApXG59XG5cbm1hcC5kYXRhID0gZGF0YVxubWFwLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRsZXQgc3RhZ2UgPSAkKCcjJyArIGNvbmZpZy5zdGFnZSlcblx0c3RhZ2UuaHRtbCgnJylcblx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gY29uZmlnLm1hcFNpemUueTsgaSsrKSB7XG5cdFx0Zm9yICh2YXIgaiA9IDE7IGogPD0gY29uZmlnLm1hcFNpemUueDsgaisrKSB7XG5cdFx0XHRsZXQgZGF0YSA9IG1hcC5kYXRhW2ktMV1bai0xXTtcblxuXHRcdFx0bGV0IHRlbXBDZWxsID0gXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwiY2VsbFwiIGlkPVwiJyArIGRhdGEuaWQgKyAnXCIgZGF0YS1yb2xlPVwiJyArIGRhdGEudHlwZSArICdcIj4nICtcblxuXHRcdFx0XHQnPC9kaXY+Jztcblx0XHRcdHN0YWdlLmFwcGVuZCh0ZW1wQ2VsbClcblx0XHRcdFxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcCIsInZhciBvYnN0YWNsZSA9IHt9XG4gXG5vYnN0YWNsZS5kYXRhID0gW11cblxub2JzdGFjbGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJ29ic3RhY2xlJykucmVtb3ZlQ2xhc3MoJ29ic3RhY2xlJylcblx0Zm9yICh2YXIgaSA9IG9ic3RhY2xlLmRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHQkKCcjJyArIG9ic3RhY2xlLmRhdGFbaV0pLmFkZENsYXNzKCdvYnN0YWNsZScpXG5cdH1cbn1cbm9ic3RhY2xlLnNldCA9IGZ1bmN0aW9uKGlkKSB7XG5cdGlmKG9ic3RhY2xlLmRhdGEuaW5kZXhPZihpZCkgPT0gLTEpIHtcblx0XHRvYnN0YWNsZS5kYXRhLnB1c2goaWQpXG5cdFx0b2JzdGFjbGUucmVuZGVyKClcblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG5cdHJldHVybiBmYWxzZVxuXHRcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gb2JzdGFjbGUiLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxudmFyIHBvd2VyID0gcmVxdWlyZSgnLi92JylcbnZhciBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcbnZhciB0b29sID0gcmVxdWlyZSgnLi90b29sJylcblxudmFyIHJvYm90ID0ge31cblxuXG5yb2JvdC5kYXRhID0ge31cblxuXG4vLyDorr7nva4gcm9ib3TnmoTlnZDmoIdcbnJvYm90LnNldCA9IGZ1bmN0aW9uKGlkKSB7XG5cdGlmKHJvYm90LmRhdGFbaWRdKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblxuXHRyb2JvdC5kYXRhW2lkXSA9IGlkXG5cdHJvYm90LnJlbmRlcigpXG5cdHJldHVybiB0cnVlXG59XG5cbi8vIOa4suafk1xucm9ib3QucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJy5yb2JvdCcpLnJlbW92ZUNsYXNzKCdyb2JvdCcpLmVtcHR5KClcblx0Zm9yKHZhciBpdGVtIGluIHJvYm90LmRhdGEpIHtcblx0XHQkKFwiI1wiICsgaXRlbSkuYWRkQ2xhc3MoJ3JvYm90JykuaHRtbCgnUicpXG5cdH1cblx0Y29uc29sZS5pbmZvKHJvYm90LmRhdGEpO1xuXHRcbn1cblxuLy8g56e75YqoXG5yb2JvdC5tb3ZlVG8gPSBmdW5jdGlvbigpIHtcblx0XG5cblx0Zm9yKHZhciBpdGVtIGluIHJvYm90LmRhdGEpIHtcblx0XHR2YXIgcG9zID0gaXRlbS5zcGxpdCgnXycpXG5cdFx0dmFyIHRtcCA9IHtcblx0XHRcdHJvYm90IDogW10sXG5cdFx0XHRwb3dlciA6IFtdLFxuXHRcdFx0ZnJlZSA6IFtdLFxuXHRcdFx0aGVybyA6IFtdXG5cdFx0fVxuXHRcdHZhciBwb3NBcnIgPSBnZXRJZExpc3QocG9zWzFdLCBwb3NbMl0pXG5cdFx0Zm9yKHZhciBpPTA7IGk8cG9zQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgb2JqID0gJChcIiNcIitwb3NBcnJbaV0pXG5cdFx0XHRpZihvYmouYXR0cignY2xhc3MnKSkge1xuXHRcdFx0XHRpZihvYmouYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxKSB7XG5cdFx0XHRcdFx0dG1wLmZyZWUucHVzaChwb3NBcnJbaV0pXG5cdFx0XHRcdH0gZWxzZSBpZihvYmouaGFzQ2xhc3MoJ3JvYm90JykpIHtcblx0XHRcdFx0XHR0bXAucm9ib3QucHVzaChwb3NBcnJbaV0pXG5cdFx0XHRcdH0gZWxzZSBpZihvYmouaGFzQ2xhc3MoJ3Bvd2VyVXAnKSkge1xuXHRcdFx0XHRcdHRtcC5wb3dlci5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygnaGVybycpKSB7XG5cdFx0XHRcdFx0dG1wLmhlcm8ucHVzaChwb3NBcnJbaV0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyDoi6XpmYTov5HmnIloZXJv77yM5YiZ5LyY5YWIaGVyb1xuXHRcdGlmKHRtcC5oZXJvLmxlbmd0aCE9MCkge1xuXG5cdFx0XHRpZihhdHRyLmxldmVsICE9IDApIHtcblx0XHRcdFx0ZGVsZXRlIHJvYm90LmRhdGFbaXRlbV1cblx0XHRcdFx0YXR0ci5jaGFuZ2UoJ3Njb3JlJywgMTAwKVxuXHRcdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnaGVybyBraWxsIGEgcm9ib3Qsd2luIDEwMCBzY29yZScsICd0ZXh0LWluZm8nKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ2ZhaWxlZCEnKVxuXHRcdFx0XHR0b29sLmNyZWF0TXNnZSgnU3lzdGVtJywnaGVybyBpcyBraWxsZWQhIHNjb3JlOicgKyBhdHRyLnNjb3JlLCAndGV4dC1kYW5nZXInKVxuXHRcdFx0fVxuXG5cdFx0XHRyb2JvdC5yZW5kZXIoKVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8g6Iul6ZmE6L+R5rKh5pyJaGVyb+S9huaYr+aciSBwb3dlci11cCDliJnkvJjlhYjmkafmr4Fwb3dlci11cFxuXHRcdGlmKHRtcC5wb3dlci5sZW5ndGghPTApIHtcblx0XHRcdFxuXG5cdFx0XHR2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHRtcC5wb3dlci5sZW5ndGgpKVxuXHRcdFx0cG93ZXIuZGVsZXRlKHRtcC5wb3dlclswXSlcblx0XHRcdGRlbGV0ZSByb2JvdC5kYXRhW2l0ZW1dXG5cdFx0XHRyb2JvdC5kYXRhW3RtcC5wb3dlcltpbmRleF1dID0gaXRlbVxuXHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsICdhIHJvYm90IGRlc3RvcnkgYSBwb3dlci11cCcsICd0ZXh0LWluZm8nKVxuXG5cdFx0XHRyb2JvdC5yZW5kZXIoKVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8g6Iul5ZGo5Zu05rKh5pyJaGVyb+S5n+ayoeaciXBvd2VyLXVwICDliJnlkJHpnaDov5FoZXJv55qE5pa55ZCR6LWwXG5cdFx0aWYodG1wLmZyZWUubGVuZ3RoIT0wKSB7XG5cdFx0XHRcblx0XHRcdHZhciBwb3MgPSBnZXRJZEJ5RGlzdGFuY2UodG1wLmZyZWUpXG5cblx0XHRcdGRlbGV0ZSByb2JvdC5kYXRhW2l0ZW1dXG5cdFx0XHRyb2JvdC5kYXRhW3Bvc10gPSBpdGVtXG5cdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnYSByb2JvdCBoYXMgbW92ZWQnLCAndGV4dC1pbmZvJylcblxuXHRcdFx0cm9ib3QucmVuZGVyKClcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXG5cdFx0Y29udGludWU7XG5cblx0fVxuXHRcbn1cblxuLy8g5Yig6Zmkcm9ib3RcbnJvYm90LmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdGRlbGV0ZSByb2JvdC5kYXRhW2lkXVxuXHRyb2JvdC5yZW5kZXIoKVxufVxuXG5cbmZ1bmN0aW9uIGdldElkTGlzdCh4LCB5KSB7XG5cdHZhciB0b3ggPSB0b3kgPSAwXG5cdHZhciBwb3NBcnIgPSBbXVxuXHRmb3IgKHZhciBpPTA7IGk8MzsgaSsrKSB7XG5cdFx0Zm9yICh2YXIgaj0wOyBqPDM7IGorKykge1xuXHRcdFx0aWYoaT09MCAmJiBpPT1qKSBjb250aW51ZTtcblx0XHRcdHZhciB0bXBfeCA9IHgvMSArIGNvbmZpZy50b0FycltpXSxcblx0XHRcdFx0dG1wX3kgPSB5LzEgKyBjb25maWcudG9BcnJbal1cblxuXHRcdFx0cG9zQXJyLnB1c2goXCJjZWxsX1wiICsgdG1wX3ggKyBcIl9cIiArIHRtcF95KVxuXHRcdH1cblx0fVxuXHQvLyBjb25zb2xlLmxvZyhwb3NBcnIsICctLS0tLScpO1xuXHRyZXR1cm4gcG9zQXJyXG59XG5cbi8vIOi/lOWbniDot53nprtoZXJvIOi3neemu+acgOefreeahOWdkOagh1xuZnVuY3Rpb24gZ2V0SWRCeURpc3RhbmNlKGlkcykge1xuXHRcblx0dmFyIGhlcm8gPSB7XG5cdFx0eCA6ICQoJy5oZXJvJykuYXR0cignaWQnKS5zcGxpdCgnXycpWzFdLFxuXHRcdHkgOiAkKCcuaGVybycpLmF0dHIoJ2lkJykuc3BsaXQoJ18nKVsyXVxuXHR9XG5cblx0dmFyIG1pbiA9IGlkc1swXTtcblxuXHRmb3IgKHZhciBpID0gMTsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBwcmUgPSB7XG5cdFx0XHRcdHggOiBpZHNbaS0xXS5zcGxpdCgnXycpWzFdLFxuXHRcdFx0XHR5IDogaWRzW2ktMV0uc3BsaXQoJ18nKVsyXVxuXHRcdFx0fSxcblx0XHRcdG5vdyA9IHtcblx0XHRcdFx0eCA6IGlkc1tpXS5zcGxpdCgnXycpWzFdLFxuXHRcdFx0XHR5IDogaWRzW2ldLnNwbGl0KCdfJylbMl1cblx0XHRcdH1cblxuXHRcdC8vIHByZSA8PSBub3cgPyB0cnVlOmZhbHNlXG5cdFx0aWYoY29tcGFyZShwcmUsIG5vdywgaGVybykpIHtcblx0XHRcdG1pbiA9IGlkc1tpLTFdXG5cdFx0fSBlbHNlIHtcblx0XHRcdG1pbiA9IGlkc1tpXVxuXHRcdH1cblx0fVxuXHRjb25zb2xlLndhcm4oJ3JvYm90JywgbWluLCAnaGVybycsIGhlcm8pO1xuXHRyZXR1cm4gbWluXG5cbn1cblxuZnVuY3Rpb24gY29tcGFyZShwLCBuLCBoZXJvKSB7XG5cdGNvbnNvbGUuaW5mbyhoZXJvKTtcblx0dmFyIHBkID0gTWF0aC5wb3coTWF0aC5hYnMocC54LWhlcm8ueCksMikgKyBNYXRoLnBvdyhNYXRoLmFicyhwLnktaGVyby55KSwgMilcblx0dmFyIG5kID0gTWF0aC5wb3coTWF0aC5hYnMobi54LWhlcm8ueCksMikgKyBNYXRoLnBvdyhNYXRoLmFicyhuLnktaGVyby55KSwgMilcblxuXHRjb25zb2xlLmxvZygncm9ib3QsaGVybycsIHBkLCBwLCBuZCwgbik7XG5cdHJldHVybiBwZCA8PSBuZCA/IHRydWU6ZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcm9ib3QiLCJ2YXIgaGVybyA9IHJlcXVpcmUoJy4vaGVybycpXG52YXIgb2JzdGFjbGUgPSByZXF1aXJlKCcuL29ic3RhY2xlJylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG52YXIgcm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcblxudmFyIHNldHVwID0ge31cblxuLy8g5LqL5Lu257uR5a6aXG5zZXR1cC5iaW5kID0gZnVuY3Rpb24oKSB7XG5cdCQoJyNzdGFnZScpLm9uKCdjbGljaycsXCIuY2VsbFwiLGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgcm9sZSA9IHByb21wdChcInNldHVwXCIpXG5cdFx0dmFyIHRhcmdldCA9ICQoZS50YXJnZXQpXG5cdFx0aW5pdENlbGwodGFyZ2V0LCByb2xlKVxuXHR9KVxufVxuXG4vLyDop6PpmaTkuovku7bnu5HlrppcbnNldHVwLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQkKCcjc3RhZ2UnKS5vZmYoJ2NsaWNrJywgJy5jZWxsJylcbn1cbmZ1bmN0aW9uIGluaXRDZWxsKHRhcmdldCwgcm9sZSkge1xuXHRzd2l0Y2gocm9sZSkge1xuXHRcdGNhc2UgXCJvXCIgOlxuXHRcdGNhc2UgXCJPXCIgOlxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSAmJiBvYnN0YWNsZS5zZXQodGFyZ2V0LmF0dHIoJ2lkJykpKXtcblx0XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiaFwiOlxuXHRcdGNhc2UgXCJIXCI6XG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0aWYoIWhlcm8uc2V0KHRhcmdldC5hdHRyKCdpZCcpKSkge1xuXHRcdFx0XHRcdGFsZXJ0KCflj6rog73mlL7nva7kuIDkuKpoZXJvIScpXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyXCI6XG5cdFx0Y2FzZSBcIlJcIjpcblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEgJiYgcm9ib3Quc2V0KHRhcmdldC5hdHRyKCdpZCcpKSl7XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDogXG5cblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRpZihOdW1iZXIocm9sZSk+PTEgJiYgTnVtYmVyKHJvbGUpPD05KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocm9sZSk7XG5cdFx0XHRcdFx0cG93ZXIuc2V0KHRhcmdldC5hdHRyKCdpZCcpLCByb2xlKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFsZXJ0KCfovpPlhaXlkb3ku6Tml6DmlYghJylcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcblx0fVxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cCIsInZhciB0b29sID0ge31cblxudG9vbC5jcmVhdGVNc2cgPSBmdW5jdGlvbihyb2xlLCBtc2csIGNsYXNzTmFtZSkge1xuXHR2YXIgaHRtbCA9IGBcblx0XHQ8cCBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPiR7cm9sZX0gOiAke21zZ308L3A+XG5cdGA7XG5cdCQoJy5tc2cnKS5hcHBlbmQoaHRtbClcblx0JCgnLm1zZycpLnNjcm9sbFRvcCgkKCcubXNnJylbMF0uc2Nyb2xsSGVpZ2h0IC0gJCgnLm1zZycpLmhlaWdodCgpKVxufVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvb2wiLCJ2YXIgcG93ZXIgPSB7fVxuXG5wb3dlci5kYXRhID0ge31cblxucG93ZXIuc2V0ID0gZnVuY3Rpb24oaWQsIHJvbGUpIHtcblx0aWYocG93ZXIuZGF0YVtpZF0pIHtcblx0XHRjb25zb2xlLmxvZygzMzMpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHBvd2VyLmRhdGFbaWRdID0gcm9sZVxuXHRwb3dlci5yZW5kZXIoKVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxucG93ZXIuZGVsZXRlID0gZnVuY3Rpb24oaWQpIHtcblx0JCgnIycgKyBpZCkuZW1wdHkoKVxuXHRkZWxldGUgcG93ZXIuZGF0YVtpZF1cblx0cG93ZXIucmVuZGVyKClcbn1cblxucG93ZXIucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJy5wb3dlclVwJykucmVtb3ZlQ2xhc3MoJ3Bvd2VyVXAnKS5lbXB0eSgpXG5cdGZvciggdmFyIGl0ZW0gaW4gcG93ZXIuZGF0YSkge1xuXHRcdCQoXCIjXCIgKyBpdGVtKS5hZGRDbGFzcygncG93ZXJVcCcpLmh0bWwoJ1BfJyArIHBvd2VyLmRhdGFbaXRlbV0pXG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwb3dlciJdfQ==
