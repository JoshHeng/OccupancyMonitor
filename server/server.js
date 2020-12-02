const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		methods: ['GET', 'POST']
	}
});

var currentPeople = 0;
const maxPeople = 1;

app.get('/', (req, res) => {
	return res.send('Occupancy monitor running');
});


http.listen(3000, () => {
	console.log('Occupancy monitor listening on port 3000');
});

setInterval(() => {
	io.emit('heartbeat', currentPeople, maxPeople);
}, 10000);