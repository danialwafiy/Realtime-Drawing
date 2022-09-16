const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
})

io.on('connection', socket => {
    socket.on('change-color', color => {
        socket.broadcast.emit('new-color', color)
    })
    socket.on('draw-line', (position) => {
        io.emit('update-drawing', position)
    })
})
