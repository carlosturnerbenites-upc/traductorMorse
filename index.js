var five = require("johnny-five"),
	board = new five.Board(),
	timePunto = 1000,// Pulso corto (en ms)
	timeLine = timePunto * 3,// Pulso largo
	timeSpaceLetter = timePunto * 5, // Sin pulso
	timeSpaceWord = timePunto * 8, // Sin pulso
	timeStop = timePunto * 14, // Sin pulso
	textMorse = '',
	codesMorse = require("./codesMorse"),
	pressCurrent = false,
	timeForSpace,
	timeForWord,
	timeForStop,
	symbolSpaceLetter = '/',
	symbolSpaceWord = '|',
	editing

function setValue(value){
	if(value == symbolSpaceWord && textMorse.slice(-1) == symbolSpaceLetter) textMorse = textMorse.replace(/\/$/,'')
	textMorse += value
	console.log(textMorse)
}
function setSpaceLetter(){
	if(!pressCurrent) {setValue(symbolSpaceLetter)}
}
function setSpaceWord(){
	if(!pressCurrent) {setValue(symbolSpaceWord)}
}
function decodeMorse(){

	if(textMorse.slice(-1) == symbolSpaceWord) textMorse = textMorse.replace(/\|$/,'')

	var words = textMorse.split("|")
	words.forEach((word,indexW) => {
		words[indexW] = word.split("/")
	})
	words.forEach((word,indexW) => {
		word.forEach((leter,indexL) => {
			words[indexW][indexL] = codesMorse[leter]
		})
	})
	var textDecode = words.join(",")
	console.log(textDecode)
}

board.on("ready", function() {

	var button = new five.Button({pin:7,holdtime:timeLine}),
		led = new five.Led(8)

	button.on("hold", function() {
		led.toggle()
		setValue('_')
	})
	button.on("up", function() {
		pressCurrent = false
		timeForSpace = setTimeout(setSpaceLetter,timeSpaceLetter)
		timeForWord = setTimeout(setSpaceWord,timeSpaceWord)
		timeForStop = setTimeout(decodeMorse,timeStop)
	})
	button.on("down", function() {
		pressCurrent = true
		clearTimeout(timeForSpace)
		clearTimeout(timeForWord)
		clearTimeout(timeForStop)
	})
	button.on("release", function() {
		led.toggle()
		setValue('.')
	})
})
