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
	$(document.body).keydown(e =>{
		if (e.keyCode == 90 && e.ctrlKey){
			console.log(e)
			$("#undo").trigger("click")
		}
	})
	$('#reset, #undo').click((e) => {

		$.ajax({
			type: 'POST',
			url: '/action',
			data : {action:$(e.target).data("action")},
			success: function(result) {
				$("#codeMorse").val(result)
			}
		})
	})
})
