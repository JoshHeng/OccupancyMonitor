const socket = io('http://localhost:3000', { //Server domain
	path: '' //Server api path
});

var full = false;
var heartbeatTimeout = null;

socket.on('heartbeat', (current, max) => {
	if (heartbeatTimeout) clearTimeout(heartbeatTimeout);

	document.getElementById('people-count-current').innerText = current;
	document.getElementById('people-count-max').innerText = max;
	
	if (current >= max && !full) {
		full = true;
		document.getElementById('people-count-div').classList.add('full');
	}
	else if (current < max && full) {
		full = false;
		document.getElementById('people-count-div').classList.remove('full');
	}

	heartbeatTimeout = setTimeout(() => {
		document.getElementById('people-count-current').innerText = '?';
		document.getElementById('people-count-max').innerText = '?';
	}, 12000);
});