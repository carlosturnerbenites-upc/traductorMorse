var five = require('johnny-five'),
	express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	bodyParser = require('body-parser'),
	board,
	decoder = require('./decoder.js'),

	timePunto = 1000,// Pulso corto (en ms)
	timeLine = timePunto * 1,// Pulso largo
	timeSpaceLetter = timePunto * 1.5, // Sin pulso
	timeSpaceWord = timePunto * 2.5, // Sin pulso
	timeStop = timePunto * 3.5, // Sin pulso
	textMorse = '',
	pressCurrent = false,
	timeForSpace,
	timeForWord,
	timeForStop,
	symbolSpaceLetter = '/',
	symbolSpaceWord = '|',
	symbolPoint = '.',
	symbolLine = '-',
	hold = false

var Decoder = new decoder({
	symbolSpaceLetter: symbolSpaceLetter,
	symbolSpaceWord: symbolSpaceWord
})
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

function setValue (value){
	if(value == symbolSpaceWord && textMorse.slice(-1) == symbolSpaceLetter) textMorse = textMorse.replace(/\/$/,'')
	textMorse += value
	io.sockets.emit('write', { value: value, text:textMorse})
}

io.on('connection', function (socket) {
	socket.emit('connection', { msg: 'connection Success', status: 1 })
})

app.post('/disconnect', function (req, res) {
	board.disconnect()
	res.send('disconnect')
})

app.post('/connect', function (req, res) {
	board = new five.Board()

	board.on('ready', function () {
		console.log(this.disconnect)
		res.json({msg: 'Conectado', status: 1})

		var button = new five.Button({pin: 7,holdtime: timeLine})
		button.on('hold', function () {
			setValue(symbolLine)
			hold = true
		})
		button.on('up', function () {
			pressCurrent = false
			timeForSpace = setTimeout(() => {
				if(!pressCurrent) {setValue(symbolSpaceLetter)}
			},timeSpaceLetter)

			timeForWord = setTimeout(() => {
				if(!pressCurrent) {setValue(symbolSpaceWord)}
			},timeSpaceWord)

			timeForStop = setTimeout(() => {
				var text = Decoder.toText(textMorse)
				io.sockets.emit('morseToText', { text:text})

			},timeStop)
		})
		button.on('down', function () {
			pressCurrent = true
			clearTimeout(timeForSpace)
			clearTimeout(timeForWord)
			clearTimeout(timeForStop)
		})
		button.on('release', function () {
			if(!hold) setValue(symbolPoint)
			hold = false
		})

		this.on('exit', function () {
			io.sockets.emit('disconnection', { msg: 'Desconectado', status: 0 })
		})
		this.on('close', function () {
			io.sockets.emit('disconnection', { msg: 'Desconectado', status: 0 })
		})
	})
})
app.post('/toMorse', function (req, res) {
	var data = req.body
	res.send(Decoder.toMorse(data.text.toUpperCase()))
})

app.get('/', function (req, res) {res.render('index')})

server.listen(8000)
