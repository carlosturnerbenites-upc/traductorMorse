var socket = io.connect('http://localhost:8000/');
socket.on('write', function (data) {
	console.log(data)
	$("#codeMorse").val(data.text)
})
socket.on('morseToText', function (data) {
	console.log(data)
	$("#translation").val(data.text)
})
socket.on('textToMorse', function (data) {
	console.log(data)
	$("#codeMorse").val(data.text)
})
socket.on('connection', function (data) {
	$('#connect').click((e) => {
		$.ajax({
			type: 'POST',
			url: '/connect',
			success: function(result) {
				console.log(result)
			}
		})
	})
	$('#disconnect').click((e) => {
		$.ajax({
			type: 'POST',
			url: '/disconnect',
			success: function(result) {
				console.log(result)
			}
		})
	})
	$('#toMorse').click((e) => {
		$.ajax({
			type: 'POST',
			url: '/toMorse',
			data: {text: $('#translation').val()},
			success: function(result) {
				console.log(result)
			}
		})
	})
	console.log(data)
})
