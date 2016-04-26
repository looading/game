var tool = {}

tool.createMsg = function(role, msg, className) {
	var html = `
		<p class="${className}">${role} : ${msg}</p>
	`;
	$('.msg').append(html)
	$('.msg').scrollTop($('.msg')[0].scrollHeight - $('.msg').height())
}




module.exports = tool