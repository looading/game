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
var obstacle = require('./obstacle')
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


// 初始化 事件
event.init = function() {

	// 开始游戏
	$('.start').on('click', function() {
		// 判断是否setup完成
		if(Object.keys(robot.data).length && Object.keys(power.data).length && hero.data.oldPos != null && Object.keys(obstacle.data).length) {
			alert('游戏开始')
			setup.cancel()
			event.create()
			$('.start').off('click').prop('disabled', true)
		} else {
			alert('请先setup hero robot obstacle power-up!')
		}
	})
	// 结束游戏
	$('.end').on('click', function() {
		alert('结束游戏')
		$(window).off('keypress')
		tool.createMsg('System', 'game over! score : ' + attr.score, 'text-danger')
		$('.end').off('click').prop('disabled', true)
	})

	// 重新开始游戏
	$('.restart').on('click', function() {
		window.location.reload();
	})
}

module.exports = event
},{"./attr":1,"./config":2,"./hero":4,"./obstacle":7,"./robot":8,"./setup":9,"./tool":10,"./v":11}],4:[function(require,module,exports){
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
				$(window).off('keypress')
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
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2F0dHIuanMiLCJhcHAvc3JjL2NvbmZpZy5qcyIsImFwcC9zcmMvZXZlbnQuanMiLCJhcHAvc3JjL2hlcm8uanMiLCJhcHAvc3JjL21haW4uanMiLCJhcHAvc3JjL21hcC5qcyIsImFwcC9zcmMvb2JzdGFjbGUuanMiLCJhcHAvc3JjL3JvYm90LmpzIiwiYXBwL3NyYy9zZXR1cC5qcyIsImFwcC9zcmMvdG9vbC5qcyIsImFwcC9zcmMvdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBhdHRyID0ge1xuXHRzY29yZSA6IDAsXG5cdGxldmVsIDogMSxcblx0cm91bmQgOiAxXG59XG5cbmF0dHIucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJy5TY29yZScpLmh0bWwoYXR0ci5zY29yZSlcblx0JCgnLmxldmVsJykuaHRtbChhdHRyLmxldmVsKVxuXHQkKCcucm91bmQgc3BhbicpLmh0bWwoYXR0ci5yb3VuZClcbn1cblxuYXR0ci5jaGFuZ2UgPSBmdW5jdGlvbiAodHlwZSwgbnVtKSB7XG5cdGlmKHR5cGUgPT0gJ3JvdW5kJykge1xuXHRcdGF0dHIubGV2ZWwgPSBhdHRyLmxldmVsID09IDA/IDA6IC0tYXR0ci5sZXZlbFxuXHR9XG5cdGF0dHJbdHlwZV0gPSBhdHRyW3R5cGVdLzEgKyBudW0vMVxuXHRhdHRyLnJlbmRlcigpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXR0ciIsImNvbnN0IGNvbmZpZyA9IHtcblx0bWFwU2l6ZSA6IHtcblx0XHR4IDogMTAsXG5cdFx0eSA6IDEwXG5cdH0sXG5cdHN0YWdlIDogJ3N0YWdlJyxcblx0dG9BcnIgOiBbLTEsMCwxXSxcblx0Y29udHJvbCA6IFsxMTksIDg3LCA5NywgNjUsIDEwMCwgNjgsIDgzICwxMTVdLFxuXHRtb3ZlQWJsZSA6IGZhbHNlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnIiwidmFyIGhlcm8gPSByZXF1aXJlKCcuL2hlcm8nKVxudmFyIHNldHVwID0gcmVxdWlyZSgnLi9zZXR1cCcpXG52YXIgcm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG52YXIgb2JzdGFjbGUgPSByZXF1aXJlKCcuL29ic3RhY2xlJylcbnZhciBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcbnZhciB0b29sID0gcmVxdWlyZSgnLi90b29sJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG5cbnZhciBldmVudCA9IHt9XG5cbi8vIHcsYSxzLGQgb3IgVyxBLFMsRFxuZXZlbnQuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG5cdCQod2luZG93KS5vbigna2V5cHJlc3MnLCBmdW5jdGlvbihlKXtcblx0XHRoZXJvLm1vdmVUbyhlLndoaWNoKVxuXHRcdHJvYm90Lm1vdmVUbygpXG5cdFx0aWYoY29uZmlnLmNvbnRyb2wuaW5kZXhPZihlLndoaWNoKSAhPSAtMSkge1xuXHRcdFx0aWYoT2JqZWN0LmtleXMocm9ib3QuZGF0YSkgPT0gMCkge1xuXHRcdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywgJ2hlcm8gYmVjb21lIHRoZSB3aW5uZXInLCAndGV4dC1kYW5nZXInKVxuXHRcdFx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0XHRcdGFsZXJ0KCd5b3Ugd2luIVxcbnNjb3JlOicgKyBhdHRyLnNjb3JlKVxuXG5cdFx0XHR9IGVsc2UgaWYoT2JqZWN0LmtleXMocG93ZXIuZGF0YSkubGVuZ3RoID09IDAgJiYgYXR0ci5sZXZlbCA9PSAwIHx8IE9iamVjdC5rZXlzKGhlcm8uZGF0YSkgPT0gMCkge1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoYXR0ci5sZXZlbCA9PSAwICYmICFjb25maWcubW92ZUFibGUpIHtcblx0XHRcdFx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0XHRcdFx0YWxlcnQoJ+W5s+WxgCcpXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCdoZXJvIGlzIGtpbGxlZCwgZmFpbGVkISBzY29yZTonICsgYXR0ci5zY29yZSwgJ3RleHQtZGFuZ2VyJylcblx0XHRcdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdFx0XHRhbGVydCgnZmFpbGVkIScpXG5cblxuXHRcdFx0fSBcblx0XHRcdGF0dHIuY2hhbmdlKCdyb3VuZCcsIDEpXG5cdFx0fVxuXHR9KVxuXG5cdFxufVxuXG5cbi8vIOWIneWni+WMliDkuovku7ZcbmV2ZW50LmluaXQgPSBmdW5jdGlvbigpIHtcblxuXHQvLyDlvIDlp4vmuLjmiI9cblx0JCgnLnN0YXJ0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8g5Yik5pat5piv5ZCmc2V0dXDlrozmiJBcblx0XHRpZihPYmplY3Qua2V5cyhyb2JvdC5kYXRhKS5sZW5ndGggJiYgT2JqZWN0LmtleXMocG93ZXIuZGF0YSkubGVuZ3RoICYmIGhlcm8uZGF0YS5vbGRQb3MgIT0gbnVsbCAmJiBPYmplY3Qua2V5cyhvYnN0YWNsZS5kYXRhKS5sZW5ndGgpIHtcblx0XHRcdGFsZXJ0KCfmuLjmiI/lvIDlp4snKVxuXHRcdFx0c2V0dXAuY2FuY2VsKClcblx0XHRcdGV2ZW50LmNyZWF0ZSgpXG5cdFx0XHQkKCcuc3RhcnQnKS5vZmYoJ2NsaWNrJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRhbGVydCgn6K+35YWIc2V0dXAgaGVybyByb2JvdCBvYnN0YWNsZSBwb3dlci11cCEnKVxuXHRcdH1cblx0fSlcblx0Ly8g57uT5p2f5ri45oiPXG5cdCQoJy5lbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRhbGVydCgn57uT5p2f5ri45oiPJylcblx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsICdnYW1lIG92ZXIhIHNjb3JlIDogJyArIGF0dHIuc2NvcmUsICd0ZXh0LWRhbmdlcicpXG5cdFx0JCgnLmVuZCcpLm9mZignY2xpY2snKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG5cdH0pXG5cblx0Ly8g6YeN5paw5byA5aeL5ri45oiPXG5cdCQoJy5yZXN0YXJ0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHR9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50IiwidmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxuXG4vLyBoZXJvYHMgZGF0YVxubGV0IGRhdGEgPSB7XG5cdHBvcyA6IG51bGwsXG5cdG9sZFBvcyA6IG51bGxcbn1cblxubGV0IGhlcm8gPSB7fVxuXG5oZXJvLmRhdGEgPSBkYXRhXG5cbmhlcm8uc2V0ID0gZnVuY3Rpb24oaWQpIHtcblx0aWYoaGVyby5kYXRhLm9sZFBvcyAhPSBudWxsKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblx0aGVyby5kYXRhLnBvcyA9IGhlcm8uZGF0YS5vbGRQb3MgPSBpZDtcblx0aGVyby5yZW5kZXIoKVxuXHRyZXR1cm4gdHJ1ZVxufVxuXG4vLyByZW5kZXIgaGVyb1xuaGVyby5yZW5kZXIgPSBmdW5jdGlvbiAoKXtcblx0JCgnIycgKyBoZXJvLmRhdGEub2xkUG9zKS5yZW1vdmVDbGFzcygnaGVybycpLmVtcHR5KClcblx0JCgnLmJpZycpLnJlbW92ZUNsYXNzKCdiaWcnKVxuXHRpZihhdHRyLmxldmVsICE9IDApIHtcblx0XHQkKCcjJyArIGhlcm8uZGF0YS5wb3MpLmFkZENsYXNzKCdiaWcnKVxuXHR9XG5cdFxuXHQkKCcjJyArIGhlcm8uZGF0YS5wb3MpLmFkZENsYXNzKCdoZXJvJykuaHRtbCgnSCcpXG59XG5cblxuLy8gY29udHJvbCBoZXJvXG5oZXJvLm1vdmVUbyA9IGZ1bmN0aW9uKGFjdGlvbikge1xuXHR2YXIgcG9zID0gaGVyby5kYXRhLnBvcy5zcGxpdCgnXycpXG5cdHN3aXRjaChhY3Rpb24pIHtcblx0XHQvLyB1cFxuXHRcdGNhc2UgMTE5OlxuXG5cdFx0Y2FzZSA4NzogXG5cdFx0XHQtLXBvc1syXVxuXHRcdFx0YnJlYWs7XG5cdFx0Ly8gbGVmdFxuXHRcdGNhc2UgOTc6XG5cdFx0Y2FzZSA2NTpcblx0XHRcdC0tcG9zWzFdXG5cdFx0XHRicmVhaztcblx0XHQvLyByaWdodFxuXHRcdGNhc2UgMTAwOlxuXHRcdGNhc2UgNjg6XG5cdFx0XHQrK3Bvc1sxXVxuXHRcdFx0Y29uc29sZS53YXJuKHBvc1sxXSk7XG5cdFx0XHRicmVhaztcblx0XHQvLyBkb3duXG5cdFx0Y2FzZSA4MzpcblxuXHRcdGNhc2UgMTE1OlxuXHRcdFx0Kytwb3NbMl1cblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0dmFyIG5ld1BvcyA9IHBvcy5qb2luKCdfJylcblx0aWYoJChcIiNcIiArIG5ld1BvcykuYXR0cignY2xhc3MnKSkge1xuXHRcdGlmKCQoXCIjXCIgKyBuZXdQb3MpLmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGg9PTEpe1xuXHRcdFx0aGVyby5kYXRhLm9sZFBvcyA9IGhlcm8uZGF0YS5wb3Ncblx0XHRcdGhlcm8uZGF0YS5wb3MgPSBwb3Muam9pbignXycpXHRcblx0XHR9IGVsc2UgaWYoJChcIiNcIiArIG5ld1BvcykuaGFzQ2xhc3MoJ3JvYm90JykpIHtcblx0XHRcdGlmKGF0dHIubGV2ZWwgIT0gMCkge1xuXHRcdFx0XHRyb2JvdC5kZWxldGUobmV3UG9zKVxuXHRcdFx0XHRoZXJvLmRhdGEub2xkUG9zID0gaGVyby5kYXRhLnBvc1xuXHRcdFx0XHRoZXJvLmRhdGEucG9zID0gcG9zLmpvaW4oJ18nKVxuXHRcdFx0XHRhdHRyLmNoYW5nZSgnc2NvcmUnLCAxMDApXHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0YWxlcnQoJ2ZhaWxlZCEnKVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZigkKFwiI1wiICsgbmV3UG9zKS5oYXNDbGFzcygncG93ZXJVcCcpKSB7XG5cdFx0XHR2YXIgbGV2ZWwgPSBwb3dlci5kYXRhW25ld1Bvc11cblx0XHRcdGF0dHIuY2hhbmdlKCdsZXZlbCcsIGxldmVsKVxuXHRcdFx0YXR0ci5jaGFuZ2UoJ3Njb3JlJywgbGV2ZWwpXG5cdFx0XHRwb3dlci5kZWxldGUobmV3UG9zKVxuXHRcdFx0aGVyby5kYXRhLm9sZFBvcyA9IGhlcm8uZGF0YS5wb3Ncblx0XHRcdGhlcm8uZGF0YS5wb3MgPSBwb3Muam9pbignXycpXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGFsZXJ0KCfkvaDkuI3og73ov5nmoLfnp7vliqjvvIHlm57lkIjnu5PmnZ/vvIEnKVxuXHR9XG5cdGNvbnNvbGUuaW5mbygnaGVybycsIGhlcm8uZGF0YSk7XG5cdGhlcm8ucmVuZGVyKClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZXJvXG5cblxuXG5cbiIsIi8vIG1hcCBtb2RhbFxudmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwJylcblxuLy8gaGVybyBtb2RhbFxudmFyIGhlcm8gPSByZXF1aXJlKCcuL2hlcm8nKVxuXG4vLyBldmVudCBtb2RhbFxudmFyIGV2ZW50ID0gcmVxdWlyZSgnLi9ldmVudCcpXG5cbi8vIG9ic3RhY2xlIG1vZGFsXG52YXIgb2JzdGFjbGUgPSByZXF1aXJlKCcuL29ic3RhY2xlJylcblxuLy8gcm9ib3QgbW9kYWxcbnZhciByb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxuXG4vLyBwb3dlci11cCBtb2RhbFxudmFyIHBvd2VyID0gcmVxdWlyZSgnLi92JylcblxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxuXG5cbnZhciBzZXR1cCA9IHJlcXVpcmUoJy4vc2V0dXAnKVxuXG5tYXAucmVuZGVyKClcblxuYXR0ci5yZW5kZXIoKVxuXG4vKipcbiAqIGdhbWUgbWFpbiBlbnRyeVxuICovXG5cbnNldHVwLmJpbmQoKVxuXG5ldmVudC5pbml0KClcblxuXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxuXG52YXIgbWFwID0gbmV3IE9iamVjdCgpXG52YXIgZGF0YSA9IG5ldyBBcnJheSgpXG5cblxuXG5cbmZvciAodmFyIGkgPSAxOyBpIDw9IGNvbmZpZy5tYXBTaXplLnk7IGkrKykge1xuXHRsZXQgdGVtcCA9IG5ldyBBcnJheSgpXG5cdGZvciAodmFyIGogPSAxOyBqIDw9IGNvbmZpZy5tYXBTaXplLng7IGorKykge1xuXHRcdGxldCBvID0ge1xuXHRcdFx0aWQgOiBcImNlbGxcIiArIFwiX1wiICsgaiArIFwiX1wiICsgaSxcblx0XHRcdHR5cGUgOiAncm9hZCdcblx0XHR9XG5cdFx0dGVtcC5wdXNoKG8pXG5cdH1cblx0ZGF0YS5wdXNoKHRlbXApXG59XG5cbm1hcC5kYXRhID0gZGF0YVxubWFwLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRsZXQgc3RhZ2UgPSAkKCcjJyArIGNvbmZpZy5zdGFnZSlcblx0c3RhZ2UuaHRtbCgnJylcblx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gY29uZmlnLm1hcFNpemUueTsgaSsrKSB7XG5cdFx0Zm9yICh2YXIgaiA9IDE7IGogPD0gY29uZmlnLm1hcFNpemUueDsgaisrKSB7XG5cdFx0XHRsZXQgZGF0YSA9IG1hcC5kYXRhW2ktMV1bai0xXTtcblxuXHRcdFx0bGV0IHRlbXBDZWxsID0gXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwiY2VsbFwiIGlkPVwiJyArIGRhdGEuaWQgKyAnXCIgZGF0YS1yb2xlPVwiJyArIGRhdGEudHlwZSArICdcIj4nICtcblxuXHRcdFx0XHQnPC9kaXY+Jztcblx0XHRcdHN0YWdlLmFwcGVuZCh0ZW1wQ2VsbClcblx0XHRcdFxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcCIsInZhciBvYnN0YWNsZSA9IHt9XG4gXG5vYnN0YWNsZS5kYXRhID0gW11cblxub2JzdGFjbGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJ29ic3RhY2xlJykucmVtb3ZlQ2xhc3MoJ29ic3RhY2xlJylcblx0Zm9yICh2YXIgaSA9IG9ic3RhY2xlLmRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHQkKCcjJyArIG9ic3RhY2xlLmRhdGFbaV0pLmFkZENsYXNzKCdvYnN0YWNsZScpXG5cdH1cbn1cbm9ic3RhY2xlLnNldCA9IGZ1bmN0aW9uKGlkKSB7XG5cdGlmKG9ic3RhY2xlLmRhdGEuaW5kZXhPZihpZCkgPT0gLTEpIHtcblx0XHRvYnN0YWNsZS5kYXRhLnB1c2goaWQpXG5cdFx0b2JzdGFjbGUucmVuZGVyKClcblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG5cdHJldHVybiBmYWxzZVxuXHRcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gb2JzdGFjbGUiLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxudmFyIHBvd2VyID0gcmVxdWlyZSgnLi92JylcbnZhciBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcbnZhciB0b29sID0gcmVxdWlyZSgnLi90b29sJylcblxudmFyIHJvYm90ID0ge31cblxuXG5yb2JvdC5kYXRhID0ge31cblxuXG4vLyDorr7nva4gcm9ib3TnmoTlnZDmoIdcbnJvYm90LnNldCA9IGZ1bmN0aW9uKGlkKSB7XG5cdGlmKHJvYm90LmRhdGFbaWRdKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblxuXHRyb2JvdC5kYXRhW2lkXSA9IGlkXG5cdHJvYm90LnJlbmRlcigpXG5cdHJldHVybiB0cnVlXG59XG5cbi8vIOa4suafk1xucm9ib3QucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJy5yb2JvdCcpLnJlbW92ZUNsYXNzKCdyb2JvdCcpLmVtcHR5KClcblx0Zm9yKHZhciBpdGVtIGluIHJvYm90LmRhdGEpIHtcblx0XHQkKFwiI1wiICsgaXRlbSkuYWRkQ2xhc3MoJ3JvYm90JykuaHRtbCgnUicpXG5cdH1cblx0Y29uc29sZS5pbmZvKHJvYm90LmRhdGEpO1xuXHRcbn1cblxuLy8g56e75YqoXG5yb2JvdC5tb3ZlVG8gPSBmdW5jdGlvbigpIHtcblxuXG5cdGZvcih2YXIgaXRlbSBpbiByb2JvdC5kYXRhKSB7XG5cdFx0dmFyIHBvcyA9IGl0ZW0uc3BsaXQoJ18nKVxuXHRcdHZhciB0bXAgPSB7XG5cdFx0XHRyb2JvdCA6IFtdLFxuXHRcdFx0cG93ZXIgOiBbXSxcblx0XHRcdGZyZWUgOiBbXSxcblx0XHRcdGhlcm8gOiBbXVxuXHRcdH1cblx0XHR2YXIgcG9zQXJyID0gZ2V0SWRMaXN0KHBvc1sxXSwgcG9zWzJdKVxuXHRcdGZvcih2YXIgaT0wOyBpPHBvc0Fyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIG9iaiA9ICQoXCIjXCIrcG9zQXJyW2ldKVxuXHRcdFx0aWYob2JqLmF0dHIoJ2NsYXNzJykpIHtcblx0XHRcdFx0aWYob2JqLmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSkge1xuXHRcdFx0XHRcdHRtcC5mcmVlLnB1c2gocG9zQXJyW2ldKVxuXHRcdFx0XHR9IGVsc2UgaWYob2JqLmhhc0NsYXNzKCdyb2JvdCcpKSB7XG5cdFx0XHRcdFx0dG1wLnJvYm90LnB1c2gocG9zQXJyW2ldKVxuXHRcdFx0XHR9IGVsc2UgaWYob2JqLmhhc0NsYXNzKCdwb3dlclVwJykpIHtcblx0XHRcdFx0XHR0bXAucG93ZXIucHVzaChwb3NBcnJbaV0pXG5cdFx0XHRcdH0gZWxzZSBpZihvYmouaGFzQ2xhc3MoJ2hlcm8nKSkge1xuXHRcdFx0XHRcdHRtcC5oZXJvLnB1c2gocG9zQXJyW2ldKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8g6Iul6ZmE6L+R5pyJaGVyb++8jOWImeS8mOWFiGhlcm9cblx0XHRpZih0bXAuaGVyby5sZW5ndGghPTApIHtcblxuXHRcdFx0aWYoYXR0ci5sZXZlbCAhPSAwKSB7XG5cdFx0XHRcdGRlbGV0ZSByb2JvdC5kYXRhW2l0ZW1dXG5cdFx0XHRcdGF0dHIuY2hhbmdlKCdzY29yZScsIDEwMClcblx0XHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsJ2hlcm8ga2lsbCBhIHJvYm90LHdpbiAxMDAgc2NvcmUnLCAndGV4dC1pbmZvJylcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCdmYWlsZWQhJylcblx0XHRcdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdFx0XHR0b29sLmNyZWF0TXNnKCdTeXN0ZW0nLCdoZXJvIGlzIGtpbGxlZCEgc2NvcmU6JyArIGF0dHIuc2NvcmUsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdFx0Y29uZmlnLm1vdmVBYmxlID0gdHJ1ZVxuXHRcdFx0cm9ib3QucmVuZGVyKClcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIOiLpemZhOi/keayoeaciWhlcm/kvYbmmK/mnIkgcG93ZXItdXAg5YiZ5LyY5YWI5pGn5q+BcG93ZXItdXBcblx0XHRpZih0bXAucG93ZXIubGVuZ3RoIT0wKSB7XG5cdFx0XHRcblxuXHRcdFx0dmFyIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKih0bXAucG93ZXIubGVuZ3RoKSlcblx0XHRcdHBvd2VyLmRlbGV0ZSh0bXAucG93ZXJbMF0pXG5cdFx0XHRkZWxldGUgcm9ib3QuZGF0YVtpdGVtXVxuXHRcdFx0cm9ib3QuZGF0YVt0bXAucG93ZXJbaW5kZXhdXSA9IGl0ZW1cblx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCAnYSByb2JvdCBkZXN0b3J5IGEgcG93ZXItdXAnLCAndGV4dC1pbmZvJylcblx0XHRcdGNvbmZpZy5tb3ZlQWJsZSA9IHRydWVcblx0XHRcdHJvYm90LnJlbmRlcigpXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHQvLyDoi6Xlkajlm7TmsqHmnIloZXJv5Lmf5rKh5pyJcG93ZXItdXAgIOWImeWQkemdoOi/kWhlcm/nmoTmlrnlkJHotbBcblx0XHRpZih0bXAuZnJlZS5sZW5ndGghPTApIHtcblx0XHRcdFxuXHRcdFx0dmFyIHBvcyA9IGdldElkQnlEaXN0YW5jZSh0bXAuZnJlZSlcblxuXHRcdFx0ZGVsZXRlIHJvYm90LmRhdGFbaXRlbV1cblx0XHRcdHJvYm90LmRhdGFbcG9zXSA9IGl0ZW1cblx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCdhIHJvYm90IGhhcyBtb3ZlZCcsICd0ZXh0LWluZm8nKVxuXG5cdFx0XHRjb25maWcubW92ZUFibGUgPSB0cnVlXG5cdFx0XHRyb2JvdC5yZW5kZXIoKVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29uZmlnLm1vdmVBYmxlID0gZmFsc2Vcblx0XHRjb250aW51ZTtcblxuXHR9XG5cdFxufVxuXG4vLyDliKDpmaRyb2JvdFxucm9ib3QuZGVsZXRlID0gZnVuY3Rpb24oaWQpIHtcblx0ZGVsZXRlIHJvYm90LmRhdGFbaWRdXG5cdHJvYm90LnJlbmRlcigpXG59XG5cblxuZnVuY3Rpb24gZ2V0SWRMaXN0KHgsIHkpIHtcblx0dmFyIHRveCA9IHRveSA9IDBcblx0dmFyIHBvc0FyciA9IFtdXG5cdGZvciAodmFyIGk9MDsgaTwzOyBpKyspIHtcblx0XHRmb3IgKHZhciBqPTA7IGo8MzsgaisrKSB7XG5cdFx0XHRpZihpPT0wICYmIGk9PWopIGNvbnRpbnVlO1xuXHRcdFx0dmFyIHRtcF94ID0geC8xICsgY29uZmlnLnRvQXJyW2ldLFxuXHRcdFx0XHR0bXBfeSA9IHkvMSArIGNvbmZpZy50b0FycltqXVxuXG5cdFx0XHRwb3NBcnIucHVzaChcImNlbGxfXCIgKyB0bXBfeCArIFwiX1wiICsgdG1wX3kpXG5cdFx0fVxuXHR9XG5cdC8vIGNvbnNvbGUubG9nKHBvc0FyciwgJy0tLS0tJyk7XG5cdHJldHVybiBwb3NBcnJcbn1cblxuLy8g6L+U5ZueIOi3neemu2hlcm8g6Led56a75pyA55+t55qE5Z2Q5qCHXG5mdW5jdGlvbiBnZXRJZEJ5RGlzdGFuY2UoaWRzKSB7XG5cdFxuXHR2YXIgaGVybyA9IHtcblx0XHR4IDogJCgnLmhlcm8nKS5hdHRyKCdpZCcpLnNwbGl0KCdfJylbMV0sXG5cdFx0eSA6ICQoJy5oZXJvJykuYXR0cignaWQnKS5zcGxpdCgnXycpWzJdXG5cdH1cblxuXHR2YXIgbWluID0gaWRzWzBdO1xuXG5cdHByZSA9IHtcblx0XHRcdFx0eCA6IGlkc1swXS5zcGxpdCgnXycpWzFdLFxuXHRcdFx0XHR5IDogaWRzWzBdLnNwbGl0KCdfJylbMl1cblx0XHRcdH1cblx0Zm9yICh2YXIgaSA9IDE7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbm93ID0ge1xuXHRcdFx0XHR4IDogaWRzW2ldLnNwbGl0KCdfJylbMV0sXG5cdFx0XHRcdHkgOiBpZHNbaV0uc3BsaXQoJ18nKVsyXVxuXHRcdFx0fVxuXG5cdFx0Ly8gcHJlIDw9IG5vdyA/IHRydWU6ZmFsc2Vcblx0XHRpZighY29tcGFyZShwcmUsIG5vdywgaGVybykpIHtcblx0XHRcdG1pbiA9IGlkc1tpXVxuXHRcdFx0cHJlID0gbm93XG5cdFx0fVxuXHR9XG5cdHJldHVybiBtaW5cblxufVxuXG5mdW5jdGlvbiBjb21wYXJlKHAsIG4sIGhlcm8pIHtcblx0dmFyIHBkID0gTWF0aC5wb3coTWF0aC5hYnMocC54LWhlcm8ueCksMikgKyBNYXRoLnBvdyhNYXRoLmFicyhwLnktaGVyby55KSwgMilcblx0dmFyIG5kID0gTWF0aC5wb3coTWF0aC5hYnMobi54LWhlcm8ueCksMikgKyBNYXRoLnBvdyhNYXRoLmFicyhuLnktaGVyby55KSwgMilcblxuXHRjb25zb2xlLmxvZygncm9ib3QsaGVybycsIHBkLCBwLCBuZCwgbik7XG5cdHJldHVybiBwZCA8PSBuZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByb2JvdCIsInZhciBoZXJvID0gcmVxdWlyZSgnLi9oZXJvJylcbnZhciBvYnN0YWNsZSA9IHJlcXVpcmUoJy4vb2JzdGFjbGUnKVxudmFyIHBvd2VyID0gcmVxdWlyZSgnLi92JylcbnZhciByb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxuXG52YXIgc2V0dXAgPSB7fVxuXG4vLyDkuovku7bnu5HlrppcbnNldHVwLmJpbmQgPSBmdW5jdGlvbigpIHtcblx0JCgnI3N0YWdlJykub24oJ2NsaWNrJyxcIi5jZWxsXCIsZnVuY3Rpb24oZSkge1xuXHRcdHZhciByb2xlID0gcHJvbXB0KFwic2V0dXBcIilcblx0XHR2YXIgdGFyZ2V0ID0gJChlLnRhcmdldClcblx0XHRpbml0Q2VsbCh0YXJnZXQsIHJvbGUpXG5cdH0pXG59XG5cbi8vIOino+mZpOS6i+S7tue7keWumlxuc2V0dXAuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdCQoJyNzdGFnZScpLm9mZignY2xpY2snLCAnLmNlbGwnKVxufVxuZnVuY3Rpb24gaW5pdENlbGwodGFyZ2V0LCByb2xlKSB7XG5cdHN3aXRjaChyb2xlKSB7XG5cdFx0Y2FzZSBcIm9cIiA6XG5cdFx0Y2FzZSBcIk9cIiA6XG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxICYmIG9ic3RhY2xlLnNldCh0YXJnZXQuYXR0cignaWQnKSkpe1xuXHRcdFx0XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJoXCI6XG5cdFx0Y2FzZSBcIkhcIjpcblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRpZighaGVyby5zZXQodGFyZ2V0LmF0dHIoJ2lkJykpKSB7XG5cdFx0XHRcdFx0YWxlcnQoJ+WPquiDveaUvue9ruS4gOS4qmhlcm8hJylcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJcIjpcblx0XHRjYXNlIFwiUlwiOlxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSAmJiByb2JvdC5zZXQodGFyZ2V0LmF0dHIoJ2lkJykpKXtcblx0XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OiBcblxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdGlmKE51bWJlcihyb2xlKT49MSAmJiBOdW1iZXIocm9sZSk8PTkpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhyb2xlKTtcblx0XHRcdFx0XHRwb3dlci5zZXQodGFyZ2V0LmF0dHIoJ2lkJyksIHJvbGUpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YWxlcnQoJ+i+k+WFpeWRveS7pOaXoOaViCEnKVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFxuXHR9XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwIiwidmFyIHRvb2wgPSB7fVxuXG50b29sLmNyZWF0ZU1zZyA9IGZ1bmN0aW9uKHJvbGUsIG1zZywgY2xhc3NOYW1lKSB7XG5cdHZhciBodG1sID0gYFxuXHRcdDxwIGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+JHtyb2xlfSA6ICR7bXNnfTwvcD5cblx0YDtcblx0JCgnLm1zZycpLmFwcGVuZChodG1sKVxuXHQkKCcubXNnJykuc2Nyb2xsVG9wKCQoJy5tc2cnKVswXS5zY3JvbGxIZWlnaHQgLSAkKCcubXNnJykuaGVpZ2h0KCkpXG59XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gdG9vbCIsInZhciBwb3dlciA9IHt9XG5cbnBvd2VyLmRhdGEgPSB7fVxuXG4vLyDorr7nva5cbnBvd2VyLnNldCA9IGZ1bmN0aW9uKGlkLCByb2xlKSB7XG5cdGlmKHBvd2VyLmRhdGFbaWRdKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cG93ZXIuZGF0YVtpZF0gPSByb2xlXG5cdHBvd2VyLnJlbmRlcigpXG5cdHJldHVybiB0cnVlO1xufVxuXG4vLyDliKDpmaRcbnBvd2VyLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdCQoJyMnICsgaWQpLmVtcHR5KClcblx0ZGVsZXRlIHBvd2VyLmRhdGFbaWRdXG5cdHBvd2VyLnJlbmRlcigpXG59XG5cbi8vIOa4suafk1xucG93ZXIucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdCQoJy5wb3dlclVwJykucmVtb3ZlQ2xhc3MoJ3Bvd2VyVXAnKS5lbXB0eSgpXG5cdGZvciggdmFyIGl0ZW0gaW4gcG93ZXIuZGF0YSkge1xuXHRcdCQoXCIjXCIgKyBpdGVtKS5hZGRDbGFzcygncG93ZXJVcCcpLmh0bWwoJ1BfJyArIHBvd2VyLmRhdGFbaXRlbV0pXG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwb3dlciJdfQ==
