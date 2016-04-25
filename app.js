var express = require('express')
var app = express()


app.use(express.static(__dirname + '/node_modules'))
app.use(express.static(__dirname + '/app'))

app.get('/', function(req, res) {
	res.sendFile('app/index.html')
})

app.listen(3000, function() {
	console.log('server is running on port : 3000')
})