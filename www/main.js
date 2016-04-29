// 配置
var config = {
	mapSize : {
		x : 10,
		y : 10
	},
	stage : 'stage',
	toArr : [-1,0,1],
	control : [119, 87, 97, 65, 100, 68, 83 ,115],
	moveAble : false
}
// map
var map = {}
map.data = new Array()
for (var i = 1; i <= config.mapSize.y; i++) {
	let temp = new Array()
	for (var j = 1; j <= config.mapSize.x; j++) {
		let o = {
			id : "cell" + "_" + j + "_" + i,
			type : 'road'
		}
		temp.push(o)
	}
	map.data.push(temp)
}
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


// 属性
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

// obstacle
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

// 能量块
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


// 消息通知 方法
var tool = {}
tool.createMsg = function(role, msg, className) {
	var html = `
		<p class="${className}">${role} : ${msg}</p>
	`;
	$('.msg').append(html)
	$('.msg').scrollTop($('.msg')[0].scrollHeight - $('.msg').height())
}


// robot 
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
				// 移除keypress事件
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
	console.info(hero);
	var pd = Math.pow(Math.abs(p.x-hero.x),2) + Math.pow(Math.abs(p.y-hero.y), 2)
	var nd = Math.pow(Math.abs(n.x-hero.x),2) + Math.pow(Math.abs(n.y-hero.y), 2)

	console.log('robot,hero', pd, p, nd, n);
	return pd <= nd ? true:false;
}



// hero
var hero = {}
hero.data = {
	pos : null,
	oldPos : null
}
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
	hero.render()
}


// setup 
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


// event
var events = {}
// w,a,s,d or W,A,S,D
events.create = function() {
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
events.init = function() {

	// 开始游戏
	$('.start').on('click', function() {
		console.info(events);
		// 判断是否setup完成
		if(Object.keys(robot.data).length && Object.keys(power.data).length && hero.data.oldPos != null && Object.keys(obstacle.data).length) {
			alert('游戏开始')
			setup.cancel();
			events.create()
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



/**
 * game start
 */
map.render()

attr.render()

/**
 * game main entry
 */

setup.bind()

events.init()