import { io } from 'socket.io-client'

var canvas = document.getElementById('drawing-canvas');
var ctx = canvas.getContext('2d');

var pos = { x: 0, y: 0 };
var currentColor = '#0000FF'

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

document.getElementById('blue-btn').addEventListener('click', (event) => {
    changeColor('#0000FF')
})
document.getElementById('red-btn').addEventListener('click', (event) => {
    changeColor('#FF0000')
})
document.getElementById('green-btn').addEventListener('click', (event) => {
    changeColor('#00FF00')
})
document.getElementById('yellow-btn').addEventListener('click', (event) => {
    changeColor('#FFFF00')
})


// SOCKET
const socket = io('http://localhost:3000')

socket.on('new-color', (color) => {
    currentColor = color
})
socket.on('update-drawing', (position) => {
    drawLine(position)
})
//

function setPosition(e) {
    var rect = canvas.getBoundingClientRect();
    pos.x = e.clientX - rect.left - canvas.clientLeft;
    pos.y = e.clientY - rect.top - canvas.clientTop;
}

function changeColor(code) {
    socket.emit('change-color', code)
    currentColor = code
}

function draw(e) {
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.moveTo(pos.x, pos.y);
    let fromX = pos.x
    let fromY = pos.y

    setPosition(e);

    ctx.lineTo(pos.x, pos.y);
    let toX = pos.x
    let toY = pos.y

    ctx.stroke();

    var position = { fromX, fromY, toX, toY };

    socket.emit('draw-line', position)
}

function drawLine(position) {
    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.moveTo(position.fromX, position.fromY);
    ctx.lineTo(position.toX, position.toY);

    ctx.stroke();
}
