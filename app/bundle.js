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
		if(!compare(pre, now, hero)) {
			min = ids[i]
			pre = now
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2F0dHIuanMiLCJhcHAvc3JjL2NvbmZpZy5qcyIsImFwcC9zcmMvZXZlbnQuanMiLCJhcHAvc3JjL2hlcm8uanMiLCJhcHAvc3JjL21haW4uanMiLCJhcHAvc3JjL21hcC5qcyIsImFwcC9zcmMvb2JzdGFjbGUuanMiLCJhcHAvc3JjL3JvYm90LmpzIiwiYXBwL3NyYy9zZXR1cC5qcyIsImFwcC9zcmMvdG9vbC5qcyIsImFwcC9zcmMvdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGF0dHIgPSB7XG5cdHNjb3JlIDogMCxcblx0bGV2ZWwgOiAxLFxuXHRyb3VuZCA6IDFcbn1cblxuYXR0ci5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0JCgnLlNjb3JlJykuaHRtbChhdHRyLnNjb3JlKVxuXHQkKCcubGV2ZWwnKS5odG1sKGF0dHIubGV2ZWwpXG5cdCQoJy5yb3VuZCBzcGFuJykuaHRtbChhdHRyLnJvdW5kKVxufVxuXG5hdHRyLmNoYW5nZSA9IGZ1bmN0aW9uICh0eXBlLCBudW0pIHtcblx0aWYodHlwZSA9PSAncm91bmQnKSB7XG5cdFx0YXR0ci5sZXZlbCA9IGF0dHIubGV2ZWwgPT0gMD8gMDogLS1hdHRyLmxldmVsXG5cdH1cblx0YXR0clt0eXBlXSA9IGF0dHJbdHlwZV0vMSArIG51bS8xXG5cdGF0dHIucmVuZGVyKClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdHRyIiwiY29uc3QgY29uZmlnID0ge1xuXHRtYXBTaXplIDoge1xuXHRcdHggOiAxMCxcblx0XHR5IDogMTBcblx0fSxcblx0c3RhZ2UgOiAnc3RhZ2UnLFxuXHR0b0FyciA6IFstMSwwLDFdLFxuXHRjb250cm9sIDogWzExOSwgODcsIDk3LCA2NSwgMTAwLCA2OCwgODMgLDExNV0sXG5cdG1vdmVBYmxlIDogZmFsc2Vcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWciLCJ2YXIgaGVybyA9IHJlcXVpcmUoJy4vaGVybycpXG52YXIgc2V0dXAgPSByZXF1aXJlKCcuL3NldHVwJylcbnZhciByb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxudmFyIHBvd2VyID0gcmVxdWlyZSgnLi92JylcbnZhciBvYnN0YWNsZSA9IHJlcXVpcmUoJy4vb2JzdGFjbGUnKVxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxudmFyIHRvb2wgPSByZXF1aXJlKCcuL3Rvb2wnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcblxudmFyIGV2ZW50ID0ge31cblxuLy8gdyxhLHMsZCBvciBXLEEsUyxEXG5ldmVudC5jcmVhdGUgPSBmdW5jdGlvbigpIHtcblx0JCh3aW5kb3cpLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpe1xuXHRcdGhlcm8ubW92ZVRvKGUud2hpY2gpXG5cdFx0cm9ib3QubW92ZVRvKClcblx0XHRpZihjb25maWcuY29udHJvbC5pbmRleE9mKGUud2hpY2gpICE9IC0xKSB7XG5cdFx0XHRpZihPYmplY3Qua2V5cyhyb2JvdC5kYXRhKSA9PSAwKSB7XG5cdFx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCAnaGVybyBiZWNvbWUgdGhlIHdpbm5lcicsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0YWxlcnQoJ3lvdSB3aW4hXFxuc2NvcmU6JyArIGF0dHIuc2NvcmUpXG5cblx0XHRcdH0gZWxzZSBpZihPYmplY3Qua2V5cyhwb3dlci5kYXRhKS5sZW5ndGggPT0gMCAmJiBhdHRyLmxldmVsID09IDAgfHwgT2JqZWN0LmtleXMoaGVyby5kYXRhKSA9PSAwKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZihhdHRyLmxldmVsID09IDAgJiYgIWNvbmZpZy5tb3ZlQWJsZSkge1xuXHRcdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0XHRhbGVydCgn5bmz5bGAJylcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsJ2hlcm8gaXMga2lsbGVkLCBmYWlsZWQhIHNjb3JlOicgKyBhdHRyLnNjb3JlLCAndGV4dC1kYW5nZXInKVxuXHRcdFx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0XHRcdGFsZXJ0KCdmYWlsZWQhJylcblxuXG5cdFx0XHR9IFxuXHRcdFx0YXR0ci5jaGFuZ2UoJ3JvdW5kJywgMSlcblx0XHR9XG5cdH0pXG5cblx0XG59XG5cblxuLy8g5Yid5aeL5YyWIOS6i+S7tlxuZXZlbnQuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdC8vIOW8gOWni+a4uOaIj1xuXHQkKCcuc3RhcnQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQvLyDliKTmlq3mmK/lkKZzZXR1cOWujOaIkFxuXHRcdGlmKE9iamVjdC5rZXlzKHJvYm90LmRhdGEpLmxlbmd0aCAmJiBPYmplY3Qua2V5cyhwb3dlci5kYXRhKS5sZW5ndGggJiYgaGVyby5kYXRhLm9sZFBvcyAhPSBudWxsICYmIE9iamVjdC5rZXlzKG9ic3RhY2xlLmRhdGEpLmxlbmd0aCkge1xuXHRcdFx0YWxlcnQoJ+a4uOaIj+W8gOWniycpXG5cdFx0XHRzZXR1cC5jYW5jZWwoKVxuXHRcdFx0ZXZlbnQuY3JlYXRlKClcblx0XHRcdCQoJy5zdGFydCcpLm9mZignY2xpY2snKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdGFsZXJ0KCfor7flhYhzZXR1cCBoZXJvIHJvYm90IG9ic3RhY2xlIHBvd2VyLXVwIScpXG5cdFx0fVxuXHR9KVxuXHQvLyDnu5PmnZ/muLjmiI9cblx0JCgnLmVuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGFsZXJ0KCfnu5PmnZ/muLjmiI8nKVxuXHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywgJ2dhbWUgb3ZlciEgc2NvcmUgOiAnICsgYXR0ci5zY29yZSwgJ3RleHQtZGFuZ2VyJylcblx0XHQkKCcuZW5kJykub2ZmKCdjbGljaycpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcblx0fSlcblxuXHQvLyDph43mlrDlvIDlp4vmuLjmiI9cblx0JCgnLnJlc3RhcnQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnQiLCJ2YXIgcm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcbnZhciBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG5cbi8vIGhlcm9gcyBkYXRhXG5sZXQgZGF0YSA9IHtcblx0cG9zIDogbnVsbCxcblx0b2xkUG9zIDogbnVsbFxufVxuXG5sZXQgaGVybyA9IHt9XG5cbmhlcm8uZGF0YSA9IGRhdGFcblxuaGVyby5zZXQgPSBmdW5jdGlvbihpZCkge1xuXHRpZihoZXJvLmRhdGEub2xkUG9zICE9IG51bGwpIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRoZXJvLmRhdGEucG9zID0gaGVyby5kYXRhLm9sZFBvcyA9IGlkO1xuXHRoZXJvLnJlbmRlcigpXG5cdHJldHVybiB0cnVlXG59XG5cbi8vIHJlbmRlciBoZXJvXG5oZXJvLnJlbmRlciA9IGZ1bmN0aW9uICgpe1xuXHQkKCcjJyArIGhlcm8uZGF0YS5vbGRQb3MpLnJlbW92ZUNsYXNzKCdoZXJvJykuZW1wdHkoKVxuXHQkKCcuYmlnJykucmVtb3ZlQ2xhc3MoJ2JpZycpXG5cdGlmKGF0dHIubGV2ZWwgIT0gMCkge1xuXHRcdCQoJyMnICsgaGVyby5kYXRhLnBvcykuYWRkQ2xhc3MoJ2JpZycpXG5cdH1cblx0XG5cdCQoJyMnICsgaGVyby5kYXRhLnBvcykuYWRkQ2xhc3MoJ2hlcm8nKS5odG1sKCdIJylcbn1cblxuXG4vLyBjb250cm9sIGhlcm9cbmhlcm8ubW92ZVRvID0gZnVuY3Rpb24oYWN0aW9uKSB7XG5cdHZhciBwb3MgPSBoZXJvLmRhdGEucG9zLnNwbGl0KCdfJylcblx0c3dpdGNoKGFjdGlvbikge1xuXHRcdC8vIHVwXG5cdFx0Y2FzZSAxMTk6XG5cblx0XHRjYXNlIDg3OiBcblx0XHRcdC0tcG9zWzJdXG5cdFx0XHRicmVhaztcblx0XHQvLyBsZWZ0XG5cdFx0Y2FzZSA5Nzpcblx0XHRjYXNlIDY1OlxuXHRcdFx0LS1wb3NbMV1cblx0XHRcdGJyZWFrO1xuXHRcdC8vIHJpZ2h0XG5cdFx0Y2FzZSAxMDA6XG5cdFx0Y2FzZSA2ODpcblx0XHRcdCsrcG9zWzFdXG5cdFx0XHRjb25zb2xlLndhcm4ocG9zWzFdKTtcblx0XHRcdGJyZWFrO1xuXHRcdC8vIGRvd25cblx0XHRjYXNlIDgzOlxuXG5cdFx0Y2FzZSAxMTU6XG5cdFx0XHQrK3Bvc1syXVxuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHR2YXIgbmV3UG9zID0gcG9zLmpvaW4oJ18nKVxuXHRpZigkKFwiI1wiICsgbmV3UG9zKS5hdHRyKCdjbGFzcycpKSB7XG5cdFx0aWYoJChcIiNcIiArIG5ld1BvcykuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aD09MSl7XG5cdFx0XHRoZXJvLmRhdGEub2xkUG9zID0gaGVyby5kYXRhLnBvc1xuXHRcdFx0aGVyby5kYXRhLnBvcyA9IHBvcy5qb2luKCdfJylcdFxuXHRcdH0gZWxzZSBpZigkKFwiI1wiICsgbmV3UG9zKS5oYXNDbGFzcygncm9ib3QnKSkge1xuXHRcdFx0aWYoYXR0ci5sZXZlbCAhPSAwKSB7XG5cdFx0XHRcdHJvYm90LmRlbGV0ZShuZXdQb3MpXG5cdFx0XHRcdGhlcm8uZGF0YS5vbGRQb3MgPSBoZXJvLmRhdGEucG9zXG5cdFx0XHRcdGhlcm8uZGF0YS5wb3MgPSBwb3Muam9pbignXycpXG5cdFx0XHRcdGF0dHIuY2hhbmdlKCdzY29yZScsIDEwMClcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdFx0XHRhbGVydCgnZmFpbGVkIScpXG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKCQoXCIjXCIgKyBuZXdQb3MpLmhhc0NsYXNzKCdwb3dlclVwJykpIHtcblx0XHRcdHZhciBsZXZlbCA9IHBvd2VyLmRhdGFbbmV3UG9zXVxuXHRcdFx0YXR0ci5jaGFuZ2UoJ2xldmVsJywgbGV2ZWwpXG5cdFx0XHRhdHRyLmNoYW5nZSgnc2NvcmUnLCBsZXZlbClcblx0XHRcdHBvd2VyLmRlbGV0ZShuZXdQb3MpXG5cdFx0XHRoZXJvLmRhdGEub2xkUG9zID0gaGVyby5kYXRhLnBvc1xuXHRcdFx0aGVyby5kYXRhLnBvcyA9IHBvcy5qb2luKCdfJylcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0YWxlcnQoJ+S9oOS4jeiDvei/meagt+enu+WKqO+8geWbnuWQiOe7k+adn++8gScpXG5cdH1cblx0Y29uc29sZS5pbmZvKCdoZXJvJywgaGVyby5kYXRhKTtcblx0aGVyby5yZW5kZXIoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhlcm9cblxuXG5cblxuIiwiLy8gbWFwIG1vZGFsXG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKVxuXG4vLyBoZXJvIG1vZGFsXG52YXIgaGVybyA9IHJlcXVpcmUoJy4vaGVybycpXG5cbi8vIGV2ZW50IG1vZGFsXG52YXIgZXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50JylcblxuLy8gb2JzdGFjbGUgbW9kYWxcbnZhciBvYnN0YWNsZSA9IHJlcXVpcmUoJy4vb2JzdGFjbGUnKVxuXG4vLyByb2JvdCBtb2RhbFxudmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG5cbi8vIHBvd2VyLXVwIG1vZGFsXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxuXG52YXIgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG5cblxudmFyIHNldHVwID0gcmVxdWlyZSgnLi9zZXR1cCcpXG5cbm1hcC5yZW5kZXIoKVxuXG5hdHRyLnJlbmRlcigpXG5cbi8qKlxuICogZ2FtZSBtYWluIGVudHJ5XG4gKi9cblxuc2V0dXAuYmluZCgpXG5cbmV2ZW50LmluaXQoKVxuXG5cbiIsInZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG5cbnZhciBtYXAgPSBuZXcgT2JqZWN0KClcbnZhciBkYXRhID0gbmV3IEFycmF5KClcblxuXG5cblxuZm9yICh2YXIgaSA9IDE7IGkgPD0gY29uZmlnLm1hcFNpemUueTsgaSsrKSB7XG5cdGxldCB0ZW1wID0gbmV3IEFycmF5KClcblx0Zm9yICh2YXIgaiA9IDE7IGogPD0gY29uZmlnLm1hcFNpemUueDsgaisrKSB7XG5cdFx0bGV0IG8gPSB7XG5cdFx0XHRpZCA6IFwiY2VsbFwiICsgXCJfXCIgKyBqICsgXCJfXCIgKyBpLFxuXHRcdFx0dHlwZSA6ICdyb2FkJ1xuXHRcdH1cblx0XHR0ZW1wLnB1c2gobylcblx0fVxuXHRkYXRhLnB1c2godGVtcClcbn1cblxubWFwLmRhdGEgPSBkYXRhXG5tYXAucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdGxldCBzdGFnZSA9ICQoJyMnICsgY29uZmlnLnN0YWdlKVxuXHRzdGFnZS5odG1sKCcnKVxuXHRmb3IgKHZhciBpID0gMTsgaSA8PSBjb25maWcubWFwU2l6ZS55OyBpKyspIHtcblx0XHRmb3IgKHZhciBqID0gMTsgaiA8PSBjb25maWcubWFwU2l6ZS54OyBqKyspIHtcblx0XHRcdGxldCBkYXRhID0gbWFwLmRhdGFbaS0xXVtqLTFdO1xuXG5cdFx0XHRsZXQgdGVtcENlbGwgPSBcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJjZWxsXCIgaWQ9XCInICsgZGF0YS5pZCArICdcIiBkYXRhLXJvbGU9XCInICsgZGF0YS50eXBlICsgJ1wiPicgK1xuXG5cdFx0XHRcdCc8L2Rpdj4nO1xuXHRcdFx0c3RhZ2UuYXBwZW5kKHRlbXBDZWxsKVxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwIiwidmFyIG9ic3RhY2xlID0ge31cbiBcbm9ic3RhY2xlLmRhdGEgPSBbXVxuXG5vYnN0YWNsZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0JCgnb2JzdGFjbGUnKS5yZW1vdmVDbGFzcygnb2JzdGFjbGUnKVxuXHRmb3IgKHZhciBpID0gb2JzdGFjbGUuZGF0YS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdCQoJyMnICsgb2JzdGFjbGUuZGF0YVtpXSkuYWRkQ2xhc3MoJ29ic3RhY2xlJylcblx0fVxufVxub2JzdGFjbGUuc2V0ID0gZnVuY3Rpb24oaWQpIHtcblx0aWYob2JzdGFjbGUuZGF0YS5pbmRleE9mKGlkKSA9PSAtMSkge1xuXHRcdG9ic3RhY2xlLmRhdGEucHVzaChpZClcblx0XHRvYnN0YWNsZS5yZW5kZXIoKVxuXHRcdHJldHVybiB0cnVlXG5cdH1cblx0cmV0dXJuIGZhbHNlXG5cdFxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBvYnN0YWNsZSIsInZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxudmFyIHRvb2wgPSByZXF1aXJlKCcuL3Rvb2wnKVxuXG52YXIgcm9ib3QgPSB7fVxuXG5cbnJvYm90LmRhdGEgPSB7fVxuXG5cbi8vIOiuvue9riByb2JvdOeahOWdkOagh1xucm9ib3Quc2V0ID0gZnVuY3Rpb24oaWQpIHtcblx0aWYocm9ib3QuZGF0YVtpZF0pIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXG5cdHJvYm90LmRhdGFbaWRdID0gaWRcblx0cm9ib3QucmVuZGVyKClcblx0cmV0dXJuIHRydWVcbn1cblxuLy8g5riy5p+TXG5yb2JvdC5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0JCgnLnJvYm90JykucmVtb3ZlQ2xhc3MoJ3JvYm90JykuZW1wdHkoKVxuXHRmb3IodmFyIGl0ZW0gaW4gcm9ib3QuZGF0YSkge1xuXHRcdCQoXCIjXCIgKyBpdGVtKS5hZGRDbGFzcygncm9ib3QnKS5odG1sKCdSJylcblx0fVxuXHRjb25zb2xlLmluZm8ocm9ib3QuZGF0YSk7XG5cdFxufVxuXG4vLyDnp7vliqhcbnJvYm90Lm1vdmVUbyA9IGZ1bmN0aW9uKCkge1xuXG5cblx0Zm9yKHZhciBpdGVtIGluIHJvYm90LmRhdGEpIHtcblx0XHR2YXIgcG9zID0gaXRlbS5zcGxpdCgnXycpXG5cdFx0dmFyIHRtcCA9IHtcblx0XHRcdHJvYm90IDogW10sXG5cdFx0XHRwb3dlciA6IFtdLFxuXHRcdFx0ZnJlZSA6IFtdLFxuXHRcdFx0aGVybyA6IFtdXG5cdFx0fVxuXHRcdHZhciBwb3NBcnIgPSBnZXRJZExpc3QocG9zWzFdLCBwb3NbMl0pXG5cdFx0Zm9yKHZhciBpPTA7IGk8cG9zQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgb2JqID0gJChcIiNcIitwb3NBcnJbaV0pXG5cdFx0XHRpZihvYmouYXR0cignY2xhc3MnKSkge1xuXHRcdFx0XHRpZihvYmouYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxKSB7XG5cdFx0XHRcdFx0dG1wLmZyZWUucHVzaChwb3NBcnJbaV0pXG5cdFx0XHRcdH0gZWxzZSBpZihvYmouaGFzQ2xhc3MoJ3JvYm90JykpIHtcblx0XHRcdFx0XHR0bXAucm9ib3QucHVzaChwb3NBcnJbaV0pXG5cdFx0XHRcdH0gZWxzZSBpZihvYmouaGFzQ2xhc3MoJ3Bvd2VyVXAnKSkge1xuXHRcdFx0XHRcdHRtcC5wb3dlci5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygnaGVybycpKSB7XG5cdFx0XHRcdFx0dG1wLmhlcm8ucHVzaChwb3NBcnJbaV0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyDoi6XpmYTov5HmnIloZXJv77yM5YiZ5LyY5YWIaGVyb1xuXHRcdGlmKHRtcC5oZXJvLmxlbmd0aCE9MCkge1xuXG5cdFx0XHRpZihhdHRyLmxldmVsICE9IDApIHtcblx0XHRcdFx0ZGVsZXRlIHJvYm90LmRhdGFbaXRlbV1cblx0XHRcdFx0YXR0ci5jaGFuZ2UoJ3Njb3JlJywgMTAwKVxuXHRcdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnaGVybyBraWxsIGEgcm9ib3Qsd2luIDEwMCBzY29yZScsICd0ZXh0LWluZm8nKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ2ZhaWxlZCEnKVxuXHRcdFx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0XHRcdHRvb2wuY3JlYXRNc2dlKCdTeXN0ZW0nLCdoZXJvIGlzIGtpbGxlZCEgc2NvcmU6JyArIGF0dHIuc2NvcmUsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHR9XG5cdFx0XHRjb25maWcubW92ZUFibGUgPSB0cnVlXG5cdFx0XHRyb2JvdC5yZW5kZXIoKVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8g6Iul6ZmE6L+R5rKh5pyJaGVyb+S9huaYr+aciSBwb3dlci11cCDliJnkvJjlhYjmkafmr4Fwb3dlci11cFxuXHRcdGlmKHRtcC5wb3dlci5sZW5ndGghPTApIHtcblx0XHRcdFxuXG5cdFx0XHR2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHRtcC5wb3dlci5sZW5ndGgpKVxuXHRcdFx0cG93ZXIuZGVsZXRlKHRtcC5wb3dlclswXSlcblx0XHRcdGRlbGV0ZSByb2JvdC5kYXRhW2l0ZW1dXG5cdFx0XHRyb2JvdC5kYXRhW3RtcC5wb3dlcltpbmRleF1dID0gaXRlbVxuXHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsICdhIHJvYm90IGRlc3RvcnkgYSBwb3dlci11cCcsICd0ZXh0LWluZm8nKVxuXHRcdFx0Y29uZmlnLm1vdmVBYmxlID0gdHJ1ZVxuXHRcdFx0cm9ib3QucmVuZGVyKClcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIOiLpeWRqOWbtOayoeaciWhlcm/kuZ/msqHmnIlwb3dlci11cCAg5YiZ5ZCR6Z2g6L+RaGVyb+eahOaWueWQkei1sFxuXHRcdGlmKHRtcC5mcmVlLmxlbmd0aCE9MCkge1xuXHRcdFx0XG5cdFx0XHR2YXIgcG9zID0gZ2V0SWRCeURpc3RhbmNlKHRtcC5mcmVlKVxuXG5cdFx0XHRkZWxldGUgcm9ib3QuZGF0YVtpdGVtXVxuXHRcdFx0cm9ib3QuZGF0YVtwb3NdID0gaXRlbVxuXHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsJ2Egcm9ib3QgaGFzIG1vdmVkJywgJ3RleHQtaW5mbycpXG5cblx0XHRcdGNvbmZpZy5tb3ZlQWJsZSA9IHRydWVcblx0XHRcdHJvYm90LnJlbmRlcigpXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRjb25maWcubW92ZUFibGUgPSBmYWxzZVxuXHRcdGNvbnRpbnVlO1xuXG5cdH1cblx0XG59XG5cbi8vIOWIoOmZpHJvYm90XG5yb2JvdC5kZWxldGUgPSBmdW5jdGlvbihpZCkge1xuXHRkZWxldGUgcm9ib3QuZGF0YVtpZF1cblx0cm9ib3QucmVuZGVyKClcbn1cblxuXG5mdW5jdGlvbiBnZXRJZExpc3QoeCwgeSkge1xuXHR2YXIgdG94ID0gdG95ID0gMFxuXHR2YXIgcG9zQXJyID0gW11cblx0Zm9yICh2YXIgaT0wOyBpPDM7IGkrKykge1xuXHRcdGZvciAodmFyIGo9MDsgajwzOyBqKyspIHtcblx0XHRcdGlmKGk9PTAgJiYgaT09aikgY29udGludWU7XG5cdFx0XHR2YXIgdG1wX3ggPSB4LzEgKyBjb25maWcudG9BcnJbaV0sXG5cdFx0XHRcdHRtcF95ID0geS8xICsgY29uZmlnLnRvQXJyW2pdXG5cblx0XHRcdHBvc0Fyci5wdXNoKFwiY2VsbF9cIiArIHRtcF94ICsgXCJfXCIgKyB0bXBfeSlcblx0XHR9XG5cdH1cblx0Ly8gY29uc29sZS5sb2cocG9zQXJyLCAnLS0tLS0nKTtcblx0cmV0dXJuIHBvc0FyclxufVxuXG4vLyDov5Tlm54g6Led56a7aGVybyDot53nprvmnIDnn63nmoTlnZDmoIdcbmZ1bmN0aW9uIGdldElkQnlEaXN0YW5jZShpZHMpIHtcblx0XG5cdHZhciBoZXJvID0ge1xuXHRcdHggOiAkKCcuaGVybycpLmF0dHIoJ2lkJykuc3BsaXQoJ18nKVsxXSxcblx0XHR5IDogJCgnLmhlcm8nKS5hdHRyKCdpZCcpLnNwbGl0KCdfJylbMl1cblx0fVxuXG5cdHZhciBtaW4gPSBpZHNbMF07XG5cblx0Zm9yICh2YXIgaSA9IDE7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgcHJlID0ge1xuXHRcdFx0XHR4IDogaWRzW2ktMV0uc3BsaXQoJ18nKVsxXSxcblx0XHRcdFx0eSA6IGlkc1tpLTFdLnNwbGl0KCdfJylbMl1cblx0XHRcdH0sXG5cdFx0XHRub3cgPSB7XG5cdFx0XHRcdHggOiBpZHNbaV0uc3BsaXQoJ18nKVsxXSxcblx0XHRcdFx0eSA6IGlkc1tpXS5zcGxpdCgnXycpWzJdXG5cdFx0XHR9XG5cblx0XHQvLyBwcmUgPD0gbm93ID8gdHJ1ZTpmYWxzZVxuXHRcdGlmKCFjb21wYXJlKHByZSwgbm93LCBoZXJvKSkge1xuXHRcdFx0bWluID0gaWRzW2ldXG5cdFx0XHRwcmUgPSBub3dcblx0XHR9XG5cdH1cblx0Y29uc29sZS53YXJuKCdyb2JvdCcsIG1pbiwgJ2hlcm8nLCBoZXJvKTtcblx0cmV0dXJuIG1pblxuXG59XG5cbmZ1bmN0aW9uIGNvbXBhcmUocCwgbiwgaGVybykge1xuXHRjb25zb2xlLmluZm8oaGVybyk7XG5cdHZhciBwZCA9IE1hdGgucG93KE1hdGguYWJzKHAueC1oZXJvLngpLDIpICsgTWF0aC5wb3coTWF0aC5hYnMocC55LWhlcm8ueSksIDIpXG5cdHZhciBuZCA9IE1hdGgucG93KE1hdGguYWJzKG4ueC1oZXJvLngpLDIpICsgTWF0aC5wb3coTWF0aC5hYnMobi55LWhlcm8ueSksIDIpXG5cblx0Y29uc29sZS5sb2coJ3JvYm90LGhlcm8nLCBwZCwgcCwgbmQsIG4pO1xuXHRyZXR1cm4gcGQgPD0gbmQgPyB0cnVlOmZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJvYm90IiwidmFyIGhlcm8gPSByZXF1aXJlKCcuL2hlcm8nKVxudmFyIG9ic3RhY2xlID0gcmVxdWlyZSgnLi9vYnN0YWNsZScpXG52YXIgcG93ZXIgPSByZXF1aXJlKCcuL3YnKVxudmFyIHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG5cbnZhciBzZXR1cCA9IHt9XG5cbi8vIOS6i+S7tue7keWumlxuc2V0dXAuYmluZCA9IGZ1bmN0aW9uKCkge1xuXHQkKCcjc3RhZ2UnKS5vbignY2xpY2snLFwiLmNlbGxcIixmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHJvbGUgPSBwcm9tcHQoXCJzZXR1cFwiKVxuXHRcdHZhciB0YXJnZXQgPSAkKGUudGFyZ2V0KVxuXHRcdGluaXRDZWxsKHRhcmdldCwgcm9sZSlcblx0fSlcbn1cblxuLy8g6Kej6Zmk5LqL5Lu257uR5a6aXG5zZXR1cC5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0JCgnI3N0YWdlJykub2ZmKCdjbGljaycsICcuY2VsbCcpXG59XG5mdW5jdGlvbiBpbml0Q2VsbCh0YXJnZXQsIHJvbGUpIHtcblx0c3dpdGNoKHJvbGUpIHtcblx0XHRjYXNlIFwib1wiIDpcblx0XHRjYXNlIFwiT1wiIDpcblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEgJiYgb2JzdGFjbGUuc2V0KHRhcmdldC5hdHRyKCdpZCcpKSl7XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcImhcIjpcblx0XHRjYXNlIFwiSFwiOlxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdGlmKCFoZXJvLnNldCh0YXJnZXQuYXR0cignaWQnKSkpIHtcblx0XHRcdFx0XHRhbGVydCgn5Y+q6IO95pS+572u5LiA5LiqaGVybyEnKVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiclwiOlxuXHRcdGNhc2UgXCJSXCI6XG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxICYmIHJvYm90LnNldCh0YXJnZXQuYXR0cignaWQnKSkpe1xuXHRcdFx0XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6IFxuXG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0aWYoTnVtYmVyKHJvbGUpPj0xICYmIE51bWJlcihyb2xlKTw9OSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJvbGUpO1xuXHRcdFx0XHRcdHBvd2VyLnNldCh0YXJnZXQuYXR0cignaWQnKSwgcm9sZSlcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhbGVydCgn6L6T5YWl5ZG95Luk5peg5pWIIScpXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XG5cdH1cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dXAiLCJ2YXIgdG9vbCA9IHt9XG5cbnRvb2wuY3JlYXRlTXNnID0gZnVuY3Rpb24ocm9sZSwgbXNnLCBjbGFzc05hbWUpIHtcblx0dmFyIGh0bWwgPSBgXG5cdFx0PHAgY2xhc3M9XCIke2NsYXNzTmFtZX1cIj4ke3JvbGV9IDogJHttc2d9PC9wPlxuXHRgO1xuXHQkKCcubXNnJykuYXBwZW5kKGh0bWwpXG5cdCQoJy5tc2cnKS5zY3JvbGxUb3AoJCgnLm1zZycpWzBdLnNjcm9sbEhlaWdodCAtICQoJy5tc2cnKS5oZWlnaHQoKSlcbn1cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB0b29sIiwidmFyIHBvd2VyID0ge31cblxucG93ZXIuZGF0YSA9IHt9XG5cbi8vIOiuvue9rlxucG93ZXIuc2V0ID0gZnVuY3Rpb24oaWQsIHJvbGUpIHtcblx0aWYocG93ZXIuZGF0YVtpZF0pIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwb3dlci5kYXRhW2lkXSA9IHJvbGVcblx0cG93ZXIucmVuZGVyKClcblx0cmV0dXJuIHRydWU7XG59XG5cbi8vIOWIoOmZpFxucG93ZXIuZGVsZXRlID0gZnVuY3Rpb24oaWQpIHtcblx0JCgnIycgKyBpZCkuZW1wdHkoKVxuXHRkZWxldGUgcG93ZXIuZGF0YVtpZF1cblx0cG93ZXIucmVuZGVyKClcbn1cblxuLy8g5riy5p+TXG5wb3dlci5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0JCgnLnBvd2VyVXAnKS5yZW1vdmVDbGFzcygncG93ZXJVcCcpLmVtcHR5KClcblx0Zm9yKCB2YXIgaXRlbSBpbiBwb3dlci5kYXRhKSB7XG5cdFx0JChcIiNcIiArIGl0ZW0pLmFkZENsYXNzKCdwb3dlclVwJykuaHRtbCgnUF8nICsgcG93ZXIuZGF0YVtpdGVtXSlcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvd2VyIl19
