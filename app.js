const express = require('express')
const app = express()


app.use(express.static(__dirname + '/node_modules'))
app.use(express.static(__dirname + '/app'))

app.get('/', (req, res) => {
	res.sendFile('app/index.html')
})

app.listen(3000, () => {
	console.log('server is running on port : 3000')
})