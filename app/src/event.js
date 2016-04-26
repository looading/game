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