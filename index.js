var five = require('johnny-five'),
	express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	bodyParser = require('body-parser'),
	board,

	timePunto = 1000,// Pulso corto (en ms)
	timeLine = timePunto * 1,// Pulso largo
	timeSpaceLetter = timePunto * 4, // Sin pulso
	timeSpaceWord = timePunto * 7, // Sin pulso
	timeStop = timePunto * 10, // Sin pulso
	textMorse = '',
	codesMorse = require('./codesMorse'),
	pressCurrent = false,
	timeForSpace,
	timeForWord,
	timeForStop,
	symbolSpaceLetter = '/',
	symbolSpaceWord = '|',
	symbolPoint = '.',
	symbolLine = '-',
	hold = false

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

function decodeMorse (){
	if(textMorse.slice(-1) == symbolSpaceWord) textMorse = textMorse.replace(/\|$/,'')

	var words = textMorse.split(symbolSpaceWord)
	words.forEach((word,indexW) => {
		words[indexW] = word.split(symbolSpaceLetter)
	})
	words.forEach((word,indexW) => {
		word.forEach((leter,indexL) => {
			words[indexW][indexL] = codesMorse[leter]
		})
	})
	var textDecode = ''
	words.forEach(e => {
		textDecode += e.join('') + ' '
	})
	io.sockets.emit('morseToText', { text:textDecode})
}

function decodeAbc(text){

	var words = text.split(" ")
	words.forEach((word,indexW) => {
		words[indexW] = word.split("")
	})
	words.forEach((word,indexW) => {
		word.forEach((leter,indexL) => {
			words[indexW][indexL] = codesMorse[leter] + symbolSpaceLetter
		})
		words[indexW].push(symbolSpaceWord)
	})
	var textDecode = words.join().replace(/,/g, '').replace(/\/\|/g, '|')
	io.sockets.emit('textToMorse', { text:textDecode})
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

			timeForStop = setTimeout(decodeMorse,timeStop)
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
		res.send('connect')
	})
})
app.post('/toMorse', function (req, res) {
	var data = req.body
	decodeAbc(data.text.toUpperCase())
})

app.get('/', function (req, res) {res.render('index')})

server.listen(8000)
