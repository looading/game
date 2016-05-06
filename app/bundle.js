(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const attr = {
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
const hero = require('./hero')
const setup = require('./setup')
const robot = require('./robot')
const power = require('./v')
const obstacle = require('./obstacle')
const attr = require('./attr')
const tool = require('./tool')
const config = require('./config')

const event = {}

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
const robot = require('./robot')
const attr = require('./attr')
const power = require('./v')

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
const map = require('./map')

// hero modal
const hero = require('./hero')

// event modal
const event = require('./event')

// obstacle modal
const obstacle = require('./obstacle')

// robot modal
const robot = require('./robot')

// power-up modal
const power = require('./v')

const attr = require('./attr')


const setup = require('./setup')

map.render()

attr.render()

/**
 * game main entry
 */

setup.bind()

event.init()



},{"./attr":1,"./event":3,"./hero":4,"./map":6,"./obstacle":7,"./robot":8,"./setup":9,"./v":11}],6:[function(require,module,exports){
const config = require('./config')

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
const hero = require('./hero')
const obstacle = require('./obstacle')
const power = require('./v')
const robot = require('./robot')

var setup = {}

// 事件绑定
setup.bind = function() {
	$('#stage').on('click',".cell",(e) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2F0dHIuanMiLCJhcHAvc3JjL2NvbmZpZy5qcyIsImFwcC9zcmMvZXZlbnQuanMiLCJhcHAvc3JjL2hlcm8uanMiLCJhcHAvc3JjL21haW4uanMiLCJhcHAvc3JjL21hcC5qcyIsImFwcC9zcmMvb2JzdGFjbGUuanMiLCJhcHAvc3JjL3JvYm90LmpzIiwiYXBwL3NyYy9zZXR1cC5qcyIsImFwcC9zcmMvdG9vbC5qcyIsImFwcC9zcmMvdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgYXR0ciA9IHtcblx0c2NvcmUgOiAwLFxuXHRsZXZlbCA6IDEsXG5cdHJvdW5kIDogMVxufVxuXG5hdHRyLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcuU2NvcmUnKS5odG1sKGF0dHIuc2NvcmUpXG5cdCQoJy5sZXZlbCcpLmh0bWwoYXR0ci5sZXZlbClcblx0JCgnLnJvdW5kIHNwYW4nKS5odG1sKGF0dHIucm91bmQpXG59XG5cbmF0dHIuY2hhbmdlID0gZnVuY3Rpb24gKHR5cGUsIG51bSkge1xuXHRpZih0eXBlID09ICdyb3VuZCcpIHtcblx0XHRhdHRyLmxldmVsID0gYXR0ci5sZXZlbCA9PSAwPyAwOiAtLWF0dHIubGV2ZWxcblx0fVxuXHRhdHRyW3R5cGVdID0gYXR0clt0eXBlXS8xICsgbnVtLzFcblx0YXR0ci5yZW5kZXIoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF0dHIiLCJjb25zdCBjb25maWcgPSB7XG5cdG1hcFNpemUgOiB7XG5cdFx0eCA6IDEwLFxuXHRcdHkgOiAxMFxuXHR9LFxuXHRzdGFnZSA6ICdzdGFnZScsXG5cdHRvQXJyIDogWy0xLDAsMV0sXG5cdGNvbnRyb2wgOiBbMTE5LCA4NywgOTcsIDY1LCAxMDAsIDY4LCA4MyAsMTE1XSxcblx0bW92ZUFibGUgOiBmYWxzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZyIsImNvbnN0IGhlcm8gPSByZXF1aXJlKCcuL2hlcm8nKVxuY29uc3Qgc2V0dXAgPSByZXF1aXJlKCcuL3NldHVwJylcbmNvbnN0IHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG5jb25zdCBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG5jb25zdCBvYnN0YWNsZSA9IHJlcXVpcmUoJy4vb2JzdGFjbGUnKVxuY29uc3QgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG5jb25zdCB0b29sID0gcmVxdWlyZSgnLi90b29sJylcbmNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcblxuY29uc3QgZXZlbnQgPSB7fVxuXG4vLyB3LGEscyxkIG9yIFcsQSxTLERcbmV2ZW50LmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuXHQkKHdpbmRvdykub24oJ2tleXByZXNzJywgZnVuY3Rpb24oZSl7XG5cdFx0aGVyby5tb3ZlVG8oZS53aGljaClcblx0XHRyb2JvdC5tb3ZlVG8oKVxuXHRcdGlmKGNvbmZpZy5jb250cm9sLmluZGV4T2YoZS53aGljaCkgIT0gLTEpIHtcblx0XHRcdGlmKE9iamVjdC5rZXlzKHJvYm90LmRhdGEpID09IDApIHtcblx0XHRcdFx0dG9vbC5jcmVhdGVNc2coJ1N5c3RlbScsICdoZXJvIGJlY29tZSB0aGUgd2lubmVyJywgJ3RleHQtZGFuZ2VyJylcblx0XHRcdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdFx0XHRhbGVydCgneW91IHdpbiFcXG5zY29yZTonICsgYXR0ci5zY29yZSlcblxuXHRcdFx0fSBlbHNlIGlmKE9iamVjdC5rZXlzKHBvd2VyLmRhdGEpLmxlbmd0aCA9PSAwICYmIGF0dHIubGV2ZWwgPT0gMCB8fCBPYmplY3Qua2V5cyhoZXJvLmRhdGEpID09IDApIHtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKGF0dHIubGV2ZWwgPT0gMCAmJiAhY29uZmlnLm1vdmVBYmxlKSB7XG5cdFx0XHRcdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdFx0XHRcdGFsZXJ0KCflubPlsYAnKVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnaGVybyBpcyBraWxsZWQsIGZhaWxlZCEgc2NvcmU6JyArIGF0dHIuc2NvcmUsICd0ZXh0LWRhbmdlcicpXG5cdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0YWxlcnQoJ2ZhaWxlZCEnKVxuXG5cblx0XHRcdH0gXG5cdFx0XHRhdHRyLmNoYW5nZSgncm91bmQnLCAxKVxuXHRcdH1cblx0fSlcblxuXHRcbn1cblxuXG4vLyDliJ3lp4vljJYg5LqL5Lu2XG5ldmVudC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cblx0Ly8g5byA5aeL5ri45oiPXG5cdCQoJy5zdGFydCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIOWIpOaWreaYr+WQpnNldHVw5a6M5oiQXG5cdFx0aWYoT2JqZWN0LmtleXMocm9ib3QuZGF0YSkubGVuZ3RoICYmIE9iamVjdC5rZXlzKHBvd2VyLmRhdGEpLmxlbmd0aCAmJiBoZXJvLmRhdGEub2xkUG9zICE9IG51bGwgJiYgT2JqZWN0LmtleXMob2JzdGFjbGUuZGF0YSkubGVuZ3RoKSB7XG5cdFx0XHRhbGVydCgn5ri45oiP5byA5aeLJylcblx0XHRcdHNldHVwLmNhbmNlbCgpXG5cdFx0XHRldmVudC5jcmVhdGUoKVxuXHRcdFx0JCgnLnN0YXJ0Jykub2ZmKCdjbGljaycpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0YWxlcnQoJ+ivt+WFiHNldHVwIGhlcm8gcm9ib3Qgb2JzdGFjbGUgcG93ZXItdXAhJylcblx0XHR9XG5cdH0pXG5cdC8vIOe7k+adn+a4uOaIj1xuXHQkKCcuZW5kJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0YWxlcnQoJ+e7k+adn+a4uOaIjycpXG5cdFx0JCh3aW5kb3cpLm9mZigna2V5cHJlc3MnKVxuXHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCAnZ2FtZSBvdmVyISBzY29yZSA6ICcgKyBhdHRyLnNjb3JlLCAndGV4dC1kYW5nZXInKVxuXHRcdCQoJy5lbmQnKS5vZmYoJ2NsaWNrJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuXHR9KVxuXG5cdC8vIOmHjeaWsOW8gOWni+a4uOaIj1xuXHQkKCcucmVzdGFydCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0fSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudCIsImNvbnN0IHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG5jb25zdCBhdHRyID0gcmVxdWlyZSgnLi9hdHRyJylcbmNvbnN0IHBvd2VyID0gcmVxdWlyZSgnLi92JylcblxuLy8gaGVyb2BzIGRhdGFcbmxldCBkYXRhID0ge1xuXHRwb3MgOiBudWxsLFxuXHRvbGRQb3MgOiBudWxsXG59XG5cbmxldCBoZXJvID0ge31cblxuaGVyby5kYXRhID0gZGF0YVxuXG5oZXJvLnNldCA9IGZ1bmN0aW9uKGlkKSB7XG5cdGlmKGhlcm8uZGF0YS5vbGRQb3MgIT0gbnVsbCkge1xuXHRcdHJldHVybiBmYWxzZVxuXHR9XG5cdGhlcm8uZGF0YS5wb3MgPSBoZXJvLmRhdGEub2xkUG9zID0gaWQ7XG5cdGhlcm8ucmVuZGVyKClcblx0cmV0dXJuIHRydWVcbn1cblxuLy8gcmVuZGVyIGhlcm9cbmhlcm8ucmVuZGVyID0gZnVuY3Rpb24gKCl7XG5cdCQoJyMnICsgaGVyby5kYXRhLm9sZFBvcykucmVtb3ZlQ2xhc3MoJ2hlcm8nKS5lbXB0eSgpXG5cdCQoJy5iaWcnKS5yZW1vdmVDbGFzcygnYmlnJylcblx0aWYoYXR0ci5sZXZlbCAhPSAwKSB7XG5cdFx0JCgnIycgKyBoZXJvLmRhdGEucG9zKS5hZGRDbGFzcygnYmlnJylcblx0fVxuXHRcblx0JCgnIycgKyBoZXJvLmRhdGEucG9zKS5hZGRDbGFzcygnaGVybycpLmh0bWwoJ0gnKVxufVxuXG5cbi8vIGNvbnRyb2wgaGVyb1xuaGVyby5tb3ZlVG8gPSBmdW5jdGlvbihhY3Rpb24pIHtcblx0dmFyIHBvcyA9IGhlcm8uZGF0YS5wb3Muc3BsaXQoJ18nKVxuXHRzd2l0Y2goYWN0aW9uKSB7XG5cdFx0Ly8gdXBcblx0XHRjYXNlIDExOTpcblxuXHRcdGNhc2UgODc6IFxuXHRcdFx0LS1wb3NbMl1cblx0XHRcdGJyZWFrO1xuXHRcdC8vIGxlZnRcblx0XHRjYXNlIDk3OlxuXHRcdGNhc2UgNjU6XG5cdFx0XHQtLXBvc1sxXVxuXHRcdFx0YnJlYWs7XG5cdFx0Ly8gcmlnaHRcblx0XHRjYXNlIDEwMDpcblx0XHRjYXNlIDY4OlxuXHRcdFx0Kytwb3NbMV1cblx0XHRcdGNvbnNvbGUud2Fybihwb3NbMV0pO1xuXHRcdFx0YnJlYWs7XG5cdFx0Ly8gZG93blxuXHRcdGNhc2UgODM6XG5cblx0XHRjYXNlIDExNTpcblx0XHRcdCsrcG9zWzJdXG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHZhciBuZXdQb3MgPSBwb3Muam9pbignXycpXG5cdGlmKCQoXCIjXCIgKyBuZXdQb3MpLmF0dHIoJ2NsYXNzJykpIHtcblx0XHRpZigkKFwiI1wiICsgbmV3UG9zKS5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoPT0xKXtcblx0XHRcdGhlcm8uZGF0YS5vbGRQb3MgPSBoZXJvLmRhdGEucG9zXG5cdFx0XHRoZXJvLmRhdGEucG9zID0gcG9zLmpvaW4oJ18nKVx0XG5cdFx0fSBlbHNlIGlmKCQoXCIjXCIgKyBuZXdQb3MpLmhhc0NsYXNzKCdyb2JvdCcpKSB7XG5cdFx0XHRpZihhdHRyLmxldmVsICE9IDApIHtcblx0XHRcdFx0cm9ib3QuZGVsZXRlKG5ld1Bvcylcblx0XHRcdFx0aGVyby5kYXRhLm9sZFBvcyA9IGhlcm8uZGF0YS5wb3Ncblx0XHRcdFx0aGVyby5kYXRhLnBvcyA9IHBvcy5qb2luKCdfJylcblx0XHRcdFx0YXR0ci5jaGFuZ2UoJ3Njb3JlJywgMTAwKVx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKHdpbmRvdykub2ZmKCdrZXlwcmVzcycpXG5cdFx0XHRcdGFsZXJ0KCdmYWlsZWQhJylcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYoJChcIiNcIiArIG5ld1BvcykuaGFzQ2xhc3MoJ3Bvd2VyVXAnKSkge1xuXHRcdFx0dmFyIGxldmVsID0gcG93ZXIuZGF0YVtuZXdQb3NdXG5cdFx0XHRhdHRyLmNoYW5nZSgnbGV2ZWwnLCBsZXZlbClcblx0XHRcdGF0dHIuY2hhbmdlKCdzY29yZScsIGxldmVsKVxuXHRcdFx0cG93ZXIuZGVsZXRlKG5ld1Bvcylcblx0XHRcdGhlcm8uZGF0YS5vbGRQb3MgPSBoZXJvLmRhdGEucG9zXG5cdFx0XHRoZXJvLmRhdGEucG9zID0gcG9zLmpvaW4oJ18nKVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRhbGVydCgn5L2g5LiN6IO96L+Z5qC356e75Yqo77yB5Zue5ZCI57uT5p2f77yBJylcblx0fVxuXHRjb25zb2xlLmluZm8oJ2hlcm8nLCBoZXJvLmRhdGEpO1xuXHRoZXJvLnJlbmRlcigpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGVyb1xuXG5cblxuXG4iLCIvLyBtYXAgbW9kYWxcbmNvbnN0IG1hcCA9IHJlcXVpcmUoJy4vbWFwJylcblxuLy8gaGVybyBtb2RhbFxuY29uc3QgaGVybyA9IHJlcXVpcmUoJy4vaGVybycpXG5cbi8vIGV2ZW50IG1vZGFsXG5jb25zdCBldmVudCA9IHJlcXVpcmUoJy4vZXZlbnQnKVxuXG4vLyBvYnN0YWNsZSBtb2RhbFxuY29uc3Qgb2JzdGFjbGUgPSByZXF1aXJlKCcuL29ic3RhY2xlJylcblxuLy8gcm9ib3QgbW9kYWxcbmNvbnN0IHJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG5cbi8vIHBvd2VyLXVwIG1vZGFsXG5jb25zdCBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG5cbmNvbnN0IGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKVxuXG5cbmNvbnN0IHNldHVwID0gcmVxdWlyZSgnLi9zZXR1cCcpXG5cbm1hcC5yZW5kZXIoKVxuXG5hdHRyLnJlbmRlcigpXG5cbi8qKlxuICogZ2FtZSBtYWluIGVudHJ5XG4gKi9cblxuc2V0dXAuYmluZCgpXG5cbmV2ZW50LmluaXQoKVxuXG5cbiIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcblxudmFyIG1hcCA9IG5ldyBPYmplY3QoKVxudmFyIGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cblxuXG5mb3IgKHZhciBpID0gMTsgaSA8PSBjb25maWcubWFwU2l6ZS55OyBpKyspIHtcblx0bGV0IHRlbXAgPSBuZXcgQXJyYXkoKVxuXHRmb3IgKHZhciBqID0gMTsgaiA8PSBjb25maWcubWFwU2l6ZS54OyBqKyspIHtcblx0XHRsZXQgbyA9IHtcblx0XHRcdGlkIDogXCJjZWxsXCIgKyBcIl9cIiArIGogKyBcIl9cIiArIGksXG5cdFx0XHR0eXBlIDogJ3JvYWQnXG5cdFx0fVxuXHRcdHRlbXAucHVzaChvKVxuXHR9XG5cdGRhdGEucHVzaCh0ZW1wKVxufVxuXG5tYXAuZGF0YSA9IGRhdGFcbm1hcC5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0bGV0IHN0YWdlID0gJCgnIycgKyBjb25maWcuc3RhZ2UpXG5cdHN0YWdlLmh0bWwoJycpXG5cdGZvciAodmFyIGkgPSAxOyBpIDw9IGNvbmZpZy5tYXBTaXplLnk7IGkrKykge1xuXHRcdGZvciAodmFyIGogPSAxOyBqIDw9IGNvbmZpZy5tYXBTaXplLng7IGorKykge1xuXHRcdFx0bGV0IGRhdGEgPSBtYXAuZGF0YVtpLTFdW2otMV07XG5cblx0XHRcdGxldCB0ZW1wQ2VsbCA9IFxuXHRcdFx0XHQnPGRpdiBjbGFzcz1cImNlbGxcIiBpZD1cIicgKyBkYXRhLmlkICsgJ1wiIGRhdGEtcm9sZT1cIicgKyBkYXRhLnR5cGUgKyAnXCI+JyArXG5cblx0XHRcdFx0JzwvZGl2Pic7XG5cdFx0XHRzdGFnZS5hcHBlbmQodGVtcENlbGwpXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXAiLCJ2YXIgb2JzdGFjbGUgPSB7fVxuIFxub2JzdGFjbGUuZGF0YSA9IFtdXG5cbm9ic3RhY2xlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCdvYnN0YWNsZScpLnJlbW92ZUNsYXNzKCdvYnN0YWNsZScpXG5cdGZvciAodmFyIGkgPSBvYnN0YWNsZS5kYXRhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0JCgnIycgKyBvYnN0YWNsZS5kYXRhW2ldKS5hZGRDbGFzcygnb2JzdGFjbGUnKVxuXHR9XG59XG5vYnN0YWNsZS5zZXQgPSBmdW5jdGlvbihpZCkge1xuXHRpZihvYnN0YWNsZS5kYXRhLmluZGV4T2YoaWQpID09IC0xKSB7XG5cdFx0b2JzdGFjbGUuZGF0YS5wdXNoKGlkKVxuXHRcdG9ic3RhY2xlLnJlbmRlcigpXG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXHRyZXR1cm4gZmFsc2Vcblx0XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG9ic3RhY2xlIiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG52YXIgYXR0ciA9IHJlcXVpcmUoJy4vYXR0cicpXG52YXIgdG9vbCA9IHJlcXVpcmUoJy4vdG9vbCcpXG5cbnZhciByb2JvdCA9IHt9XG5cblxucm9ib3QuZGF0YSA9IHt9XG5cblxuLy8g6K6+572uIHJvYm9055qE5Z2Q5qCHXG5yb2JvdC5zZXQgPSBmdW5jdGlvbihpZCkge1xuXHRpZihyb2JvdC5kYXRhW2lkXSkge1xuXHRcdHJldHVybiBmYWxzZVxuXHR9XG5cblx0cm9ib3QuZGF0YVtpZF0gPSBpZFxuXHRyb2JvdC5yZW5kZXIoKVxuXHRyZXR1cm4gdHJ1ZVxufVxuXG4vLyDmuLLmn5NcbnJvYm90LnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcucm9ib3QnKS5yZW1vdmVDbGFzcygncm9ib3QnKS5lbXB0eSgpXG5cdGZvcih2YXIgaXRlbSBpbiByb2JvdC5kYXRhKSB7XG5cdFx0JChcIiNcIiArIGl0ZW0pLmFkZENsYXNzKCdyb2JvdCcpLmh0bWwoJ1InKVxuXHR9XG5cdGNvbnNvbGUuaW5mbyhyb2JvdC5kYXRhKTtcblx0XG59XG5cbi8vIOenu+WKqFxucm9ib3QubW92ZVRvID0gZnVuY3Rpb24oKSB7XG5cblxuXHRmb3IodmFyIGl0ZW0gaW4gcm9ib3QuZGF0YSkge1xuXHRcdHZhciBwb3MgPSBpdGVtLnNwbGl0KCdfJylcblx0XHR2YXIgdG1wID0ge1xuXHRcdFx0cm9ib3QgOiBbXSxcblx0XHRcdHBvd2VyIDogW10sXG5cdFx0XHRmcmVlIDogW10sXG5cdFx0XHRoZXJvIDogW11cblx0XHR9XG5cdFx0dmFyIHBvc0FyciA9IGdldElkTGlzdChwb3NbMV0sIHBvc1syXSlcblx0XHRmb3IodmFyIGk9MDsgaTxwb3NBcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBvYmogPSAkKFwiI1wiK3Bvc0FycltpXSlcblx0XHRcdGlmKG9iai5hdHRyKCdjbGFzcycpKSB7XG5cdFx0XHRcdGlmKG9iai5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0XHR0bXAuZnJlZS5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygncm9ib3QnKSkge1xuXHRcdFx0XHRcdHRtcC5yb2JvdC5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fSBlbHNlIGlmKG9iai5oYXNDbGFzcygncG93ZXJVcCcpKSB7XG5cdFx0XHRcdFx0dG1wLnBvd2VyLnB1c2gocG9zQXJyW2ldKVxuXHRcdFx0XHR9IGVsc2UgaWYob2JqLmhhc0NsYXNzKCdoZXJvJykpIHtcblx0XHRcdFx0XHR0bXAuaGVyby5wdXNoKHBvc0FycltpXSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIOiLpemZhOi/keaciWhlcm/vvIzliJnkvJjlhYhoZXJvXG5cdFx0aWYodG1wLmhlcm8ubGVuZ3RoIT0wKSB7XG5cblx0XHRcdGlmKGF0dHIubGV2ZWwgIT0gMCkge1xuXHRcdFx0XHRkZWxldGUgcm9ib3QuZGF0YVtpdGVtXVxuXHRcdFx0XHRhdHRyLmNoYW5nZSgnc2NvcmUnLCAxMDApXG5cdFx0XHRcdHRvb2wuY3JlYXRlTXNnKCdTeXN0ZW0nLCdoZXJvIGtpbGwgYSByb2JvdCx3aW4gMTAwIHNjb3JlJywgJ3RleHQtaW5mbycpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgnZmFpbGVkIScpXG5cdFx0XHRcdCQod2luZG93KS5vZmYoJ2tleXByZXNzJylcblx0XHRcdFx0dG9vbC5jcmVhdE1zZ2UoJ1N5c3RlbScsJ2hlcm8gaXMga2lsbGVkISBzY29yZTonICsgYXR0ci5zY29yZSwgJ3RleHQtZGFuZ2VyJylcblx0XHRcdH1cblx0XHRcdGNvbmZpZy5tb3ZlQWJsZSA9IHRydWVcblx0XHRcdHJvYm90LnJlbmRlcigpXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHQvLyDoi6XpmYTov5HmsqHmnIloZXJv5L2G5piv5pyJIHBvd2VyLXVwIOWImeS8mOWFiOaRp+avgXBvd2VyLXVwXG5cdFx0aWYodG1wLnBvd2VyLmxlbmd0aCE9MCkge1xuXHRcdFx0XG5cblx0XHRcdHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoodG1wLnBvd2VyLmxlbmd0aCkpXG5cdFx0XHRwb3dlci5kZWxldGUodG1wLnBvd2VyWzBdKVxuXHRcdFx0ZGVsZXRlIHJvYm90LmRhdGFbaXRlbV1cblx0XHRcdHJvYm90LmRhdGFbdG1wLnBvd2VyW2luZGV4XV0gPSBpdGVtXG5cdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywgJ2Egcm9ib3QgZGVzdG9yeSBhIHBvd2VyLXVwJywgJ3RleHQtaW5mbycpXG5cdFx0XHRjb25maWcubW92ZUFibGUgPSB0cnVlXG5cdFx0XHRyb2JvdC5yZW5kZXIoKVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8g6Iul5ZGo5Zu05rKh5pyJaGVyb+S5n+ayoeaciXBvd2VyLXVwICDliJnlkJHpnaDov5FoZXJv55qE5pa55ZCR6LWwXG5cdFx0aWYodG1wLmZyZWUubGVuZ3RoIT0wKSB7XG5cdFx0XHRcblx0XHRcdHZhciBwb3MgPSBnZXRJZEJ5RGlzdGFuY2UodG1wLmZyZWUpXG5cblx0XHRcdGRlbGV0ZSByb2JvdC5kYXRhW2l0ZW1dXG5cdFx0XHRyb2JvdC5kYXRhW3Bvc10gPSBpdGVtXG5cdFx0XHR0b29sLmNyZWF0ZU1zZygnU3lzdGVtJywnYSByb2JvdCBoYXMgbW92ZWQnLCAndGV4dC1pbmZvJylcblxuXHRcdFx0Y29uZmlnLm1vdmVBYmxlID0gdHJ1ZVxuXHRcdFx0cm9ib3QucmVuZGVyKClcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGNvbmZpZy5tb3ZlQWJsZSA9IGZhbHNlXG5cdFx0Y29udGludWU7XG5cblx0fVxuXHRcbn1cblxuLy8g5Yig6Zmkcm9ib3RcbnJvYm90LmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdGRlbGV0ZSByb2JvdC5kYXRhW2lkXVxuXHRyb2JvdC5yZW5kZXIoKVxufVxuXG5cbmZ1bmN0aW9uIGdldElkTGlzdCh4LCB5KSB7XG5cdHZhciB0b3ggPSB0b3kgPSAwXG5cdHZhciBwb3NBcnIgPSBbXVxuXHRmb3IgKHZhciBpPTA7IGk8MzsgaSsrKSB7XG5cdFx0Zm9yICh2YXIgaj0wOyBqPDM7IGorKykge1xuXHRcdFx0aWYoaT09MCAmJiBpPT1qKSBjb250aW51ZTtcblx0XHRcdHZhciB0bXBfeCA9IHgvMSArIGNvbmZpZy50b0FycltpXSxcblx0XHRcdFx0dG1wX3kgPSB5LzEgKyBjb25maWcudG9BcnJbal1cblxuXHRcdFx0cG9zQXJyLnB1c2goXCJjZWxsX1wiICsgdG1wX3ggKyBcIl9cIiArIHRtcF95KVxuXHRcdH1cblx0fVxuXHQvLyBjb25zb2xlLmxvZyhwb3NBcnIsICctLS0tLScpO1xuXHRyZXR1cm4gcG9zQXJyXG59XG5cbi8vIOi/lOWbniDot53nprtoZXJvIOi3neemu+acgOefreeahOWdkOagh1xuZnVuY3Rpb24gZ2V0SWRCeURpc3RhbmNlKGlkcykge1xuXHRcblx0dmFyIGhlcm8gPSB7XG5cdFx0eCA6ICQoJy5oZXJvJykuYXR0cignaWQnKS5zcGxpdCgnXycpWzFdLFxuXHRcdHkgOiAkKCcuaGVybycpLmF0dHIoJ2lkJykuc3BsaXQoJ18nKVsyXVxuXHR9XG5cblx0dmFyIG1pbiA9IGlkc1swXTtcblxuXHRmb3IgKHZhciBpID0gMTsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBwcmUgPSB7XG5cdFx0XHRcdHggOiBpZHNbaS0xXS5zcGxpdCgnXycpWzFdLFxuXHRcdFx0XHR5IDogaWRzW2ktMV0uc3BsaXQoJ18nKVsyXVxuXHRcdFx0fSxcblx0XHRcdG5vdyA9IHtcblx0XHRcdFx0eCA6IGlkc1tpXS5zcGxpdCgnXycpWzFdLFxuXHRcdFx0XHR5IDogaWRzW2ldLnNwbGl0KCdfJylbMl1cblx0XHRcdH1cblxuXHRcdC8vIHByZSA8PSBub3cgPyB0cnVlOmZhbHNlXG5cdFx0aWYoIWNvbXBhcmUocHJlLCBub3csIGhlcm8pKSB7XG5cdFx0XHRtaW4gPSBpZHNbaV1cblx0XHRcdHByZSA9IG5vd1xuXHRcdH1cblx0fVxuXHRjb25zb2xlLndhcm4oJ3JvYm90JywgbWluLCAnaGVybycsIGhlcm8pO1xuXHRyZXR1cm4gbWluXG5cbn1cblxuZnVuY3Rpb24gY29tcGFyZShwLCBuLCBoZXJvKSB7XG5cdGNvbnNvbGUuaW5mbyhoZXJvKTtcblx0dmFyIHBkID0gTWF0aC5wb3coTWF0aC5hYnMocC54LWhlcm8ueCksMikgKyBNYXRoLnBvdyhNYXRoLmFicyhwLnktaGVyby55KSwgMilcblx0dmFyIG5kID0gTWF0aC5wb3coTWF0aC5hYnMobi54LWhlcm8ueCksMikgKyBNYXRoLnBvdyhNYXRoLmFicyhuLnktaGVyby55KSwgMilcblxuXHRjb25zb2xlLmxvZygncm9ib3QsaGVybycsIHBkLCBwLCBuZCwgbik7XG5cdHJldHVybiBwZCA8PSBuZCA/IHRydWU6ZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcm9ib3QiLCJjb25zdCBoZXJvID0gcmVxdWlyZSgnLi9oZXJvJylcbmNvbnN0IG9ic3RhY2xlID0gcmVxdWlyZSgnLi9vYnN0YWNsZScpXG5jb25zdCBwb3dlciA9IHJlcXVpcmUoJy4vdicpXG5jb25zdCByb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxuXG52YXIgc2V0dXAgPSB7fVxuXG4vLyDkuovku7bnu5HlrppcbnNldHVwLmJpbmQgPSBmdW5jdGlvbigpIHtcblx0JCgnI3N0YWdlJykub24oJ2NsaWNrJyxcIi5jZWxsXCIsKGUpID0+IHtcblx0XHR2YXIgcm9sZSA9IHByb21wdChcInNldHVwXCIpXG5cdFx0dmFyIHRhcmdldCA9ICQoZS50YXJnZXQpXG5cdFx0aW5pdENlbGwodGFyZ2V0LCByb2xlKVxuXHR9KVxufVxuXG4vLyDop6PpmaTkuovku7bnu5HlrppcbnNldHVwLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQkKCcjc3RhZ2UnKS5vZmYoJ2NsaWNrJywgJy5jZWxsJylcbn1cbmZ1bmN0aW9uIGluaXRDZWxsKHRhcmdldCwgcm9sZSkge1xuXHRzd2l0Y2gocm9sZSkge1xuXHRcdGNhc2UgXCJvXCIgOlxuXHRcdGNhc2UgXCJPXCIgOlxuXHRcdFx0aWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykuc3BsaXQoJyAnKS5sZW5ndGggPT0gMSAmJiBvYnN0YWNsZS5zZXQodGFyZ2V0LmF0dHIoJ2lkJykpKXtcblx0XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGVydCgn5LiA5Liq5Y2V5YWD5qC85Y+q6IO95pyJ5LiA5Liqb2JqZWN0IScpXG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiaFwiOlxuXHRcdGNhc2UgXCJIXCI6XG5cdFx0XHRpZih0YXJnZXQuYXR0cignY2xhc3MnKS5zcGxpdCgnICcpLmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0aWYoIWhlcm8uc2V0KHRhcmdldC5hdHRyKCdpZCcpKSkge1xuXHRcdFx0XHRcdGFsZXJ0KCflj6rog73mlL7nva7kuIDkuKpoZXJvIScpXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KCfkuIDkuKrljZXlhYPmoLzlj6rog73mnInkuIDkuKpvYmplY3QhJylcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyXCI6XG5cdFx0Y2FzZSBcIlJcIjpcblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEgJiYgcm9ib3Quc2V0KHRhcmdldC5hdHRyKCdpZCcpKSl7XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDogXG5cblx0XHRcdGlmKHRhcmdldC5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJykubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRpZihOdW1iZXIocm9sZSk+PTEgJiYgTnVtYmVyKHJvbGUpPD05KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocm9sZSk7XG5cdFx0XHRcdFx0cG93ZXIuc2V0KHRhcmdldC5hdHRyKCdpZCcpLCByb2xlKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFsZXJ0KCfovpPlhaXlkb3ku6Tml6DmlYghJylcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoJ+S4gOS4quWNleWFg+agvOWPquiDveacieS4gOS4qm9iamVjdCEnKVxuXHRcdFx0fVxuXHRcblx0fVxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cCIsInZhciB0b29sID0ge31cblxudG9vbC5jcmVhdGVNc2cgPSBmdW5jdGlvbihyb2xlLCBtc2csIGNsYXNzTmFtZSkge1xuXHR2YXIgaHRtbCA9IGBcblx0XHQ8cCBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPiR7cm9sZX0gOiAke21zZ308L3A+XG5cdGA7XG5cdCQoJy5tc2cnKS5hcHBlbmQoaHRtbClcblx0JCgnLm1zZycpLnNjcm9sbFRvcCgkKCcubXNnJylbMF0uc2Nyb2xsSGVpZ2h0IC0gJCgnLm1zZycpLmhlaWdodCgpKVxufVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvb2wiLCJ2YXIgcG93ZXIgPSB7fVxuXG5wb3dlci5kYXRhID0ge31cblxuLy8g6K6+572uXG5wb3dlci5zZXQgPSBmdW5jdGlvbihpZCwgcm9sZSkge1xuXHRpZihwb3dlci5kYXRhW2lkXSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHBvd2VyLmRhdGFbaWRdID0gcm9sZVxuXHRwb3dlci5yZW5kZXIoKVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuLy8g5Yig6ZmkXG5wb3dlci5kZWxldGUgPSBmdW5jdGlvbihpZCkge1xuXHQkKCcjJyArIGlkKS5lbXB0eSgpXG5cdGRlbGV0ZSBwb3dlci5kYXRhW2lkXVxuXHRwb3dlci5yZW5kZXIoKVxufVxuXG4vLyDmuLLmn5NcbnBvd2VyLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQkKCcucG93ZXJVcCcpLnJlbW92ZUNsYXNzKCdwb3dlclVwJykuZW1wdHkoKVxuXHRmb3IoIHZhciBpdGVtIGluIHBvd2VyLmRhdGEpIHtcblx0XHQkKFwiI1wiICsgaXRlbSkuYWRkQ2xhc3MoJ3Bvd2VyVXAnKS5odG1sKCdQXycgKyBwb3dlci5kYXRhW2l0ZW1dKVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcG93ZXIiXX0=
