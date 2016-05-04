var socket = io.connect('http://localhost:8000/');
socket.on('write', function (data) {
	console.log(data)
	$("#codeMorse").val(data.text)
})
socket.on('morseToText', function (data) {
	console.log(data)
	$("#translation").val(data.text)
})
socket.on('disconnection', function (data) {
	$("#stateConection")
		.removeClass("label-success")
		.addClass("label-danger")
		.html(data.msg)

})
socket.on('connection', function (data) {
	$('#connect').click((e) => {
		$.ajax({
			type: 'POST',
			url: '/connect',
			success: function(result) {
				if(result.status){
					$("#stateConection")
						.removeClass("label-danger")
						.addClass("label-success")
						.html(result.msg)
				}
			}
		})
	})
	$('#disconnect').click((e) => {
		$.ajax({
			type: 'POST',
			url: '/disconnect',
			success: function(result) {
			}
		})
	})
	$('#toMorse').click((e) => {
		$.ajax({
			type: 'POST',
			url: '/toMorse',
			data: {text: $('#translation').val()},
			success: function(result) {
				$("#codeMorse").val(result)
			}
		})
	})
	console.log(data)
})
