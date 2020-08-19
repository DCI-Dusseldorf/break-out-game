let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');

context.beginPath();
context.rect(20, 20, 50, 50);
context.fillStyle = '#ff0000';
context.fill();
context.closePath();

context.beginPath();
context.arc(480, 320, 10, 0, 20);
context.fillStyle = 'green';
context.fill();
context.closePath();

context.beginPath();
context.rect(320, 20, 100, 40);
context.fillStyle = 'blue';
context.fill();
context.closePath();
