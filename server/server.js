const maxPeople = 1; //Maximum people allowed at once
const secret = 'secret'; //Secret for the button client

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		methods: ['GET', 'POST']
	}
});

var currentPeople = 0;

app.post('/', (req, res) => {
	return res.send('Occupancy monitor running');
});
app.post('/increase', (req, res) => {
	if (req.query.secret !== secret) return res.status(403).json({ error: 'Forbidden'});

	currentPeople += 1;
	io.emit('heartbeat', currentPeople, maxPeople);

	return res.status(200).json({ success: true });
});
app.post('/decrease', (req, res) => {
	if (req.query.secret !== secret) return res.status(403).json({ error: 'Forbidden'});
	if (currentPeople <= 0) return res.status(403).json({ error: 'Cannot decrease below 0'});

	currentPeople -= 1;
	io.emit('heartbeat', currentPeople, maxPeople);

	return res.status(200).json({ success: true });
});


http.listen(3000, () => {
	console.log('Occupancy monitor listening on port 3000');
});

setInterval(() => {
	io.emit('heartbeat', currentPeople, maxPeople);
}, 10000);