var morseToText = require('./morseToText'),
	textToMorse = require('./textToMorse')

function decoder (config) {
	var symbolSpaceLetter = config.symbolSpaceLetter,
		symbolSpaceWord = config.symbolSpaceWord
	this.toText = function(textMorse){
		if(textMorse.slice(-1) == symbolSpaceWord) textMorse = textMorse.replace(/\|$/,'')

		var words = textMorse.split(symbolSpaceWord)
		words.forEach((word,indexW) => {
			words[indexW] = word.split(symbolSpaceLetter)
		})
		words.forEach((word,indexW) => {
			word.forEach((leter,indexL) => {
				words[indexW][indexL] = morseToText[leter]
			})
		})
		var textDecode = ''
		words.forEach(e => {
			textDecode += e.join('') + ' '
		})
		return textDecode
	}

	this.toMorse = function (text){

		var words = text.split(' ')
		words.forEach((word,indexW) => {
			words[indexW] = word.split('')
		})
		words.forEach((word,indexW) => {
			word.forEach((leter,indexL) => {
				words[indexW][indexL] = textToMorse[leter] + symbolSpaceLetter
			})
			words[indexW].push(symbolSpaceWord)
		})
		var textDecode = words.join().replace(/,/g, '').replace(/\/\|/g, '|')
		return textDecode
	}
}

module.exports = decoder
