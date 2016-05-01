var five = require("johnny-five"),
	board = new five.Board(),
	timePunto = 1000,// Pulso corto
	timeLine = timePunto * 3,// Pulso largo
	timeSpaceLetter = timePunto * 3, // Sin pulso
	timeSpaceWord = timeLine *3, // Sin pulso
	textMorse = '',
	codesMorse = require("./codesMorse"),
	pressCurrent = false,
	timeForSpace,
	editing

function setValue(value){
	textMorse += value
	console.log(textMorse)
}
function setSpace(){
	if(!pressCurrent) {setValue("/")}
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
		timeForSpace = setTimeout(setSpace,timeSpaceLetter)
	})
	button.on("down", function() {
		pressCurrent = true
		clearTimeout(timeForSpace)
	})
	button.on("release", function() {
		led.toggle()
		setValue('.')
	})
})
