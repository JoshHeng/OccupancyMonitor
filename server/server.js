const maxPeople = parseInt(process.env.MAX_PEOPLE) || 5; //Maximum people allowed at once
const secret = process.env.SECRET || 'secret'; //Secret for the button client

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		methods: ['GET', 'POST']
	}
});


var currentPeople = 0;

app.use(express.static('public'));
app.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname  + '/index.html'));
});
app.get('/status', (req, res) => {
	return res.status(200).json({ max: currentPeople >= maxPeople });
});
app.get('/api', (req, res) => {
	return res.send('Occupancy monitor running');
});
app.get('/increase', (req, res) => {
	if (req.query.secret !== secret) return res.status(403).json({ error: 'Forbidden'});

	currentPeople += 1;
	io.emit('heartbeat', currentPeople, maxPeople);

	return res.status(200).json({ success: true });
});
app.get('/decrease', (req, res) => {
	if (req.query.secret !== secret) return res.status(403).json({ error: 'Forbidden'});
	if (currentPeople <= 0) return res.status(403).json({ error: 'Cannot decrease below 0'});

	currentPeople -= 1;
	io.emit('heartbeat', currentPeople, maxPeople);

	return res.status(200).json({ success: true });
});

io.on('connection', socket => {
	socket.emit('heartbeat', currentPeople, maxPeople);
});


http.listen(3000, () => {
	console.log('Occupancy monitor listening on port 3000');
});

setInterval(() => {
	io.emit('heartbeat', currentPeople, maxPeople);
}, 10000);