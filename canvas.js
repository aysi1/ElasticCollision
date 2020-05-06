var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

const colors = [
    '#3868FF',
    '#338EE8',
    '#44D4FF',
    '#33E8E2',
    '#38FFC0'
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * (colors.length - 1))];
}

function Timer() {
    this.Time0 = new Date();
    this.restart = function () {
        this.Time0 = new Date();
    }
    this.getTime = function () {
        let currentTime = new Date();
        return (currentTime.getTime() - this.Time0.getTime())/1000;
    }
}

function checkCollision(ball1, ball2) {
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    if (Math.sqrt(dx*dx + dy*dy) <= ball1.r + ball2.r)
        return true;
    return false;
}

function Ball(x, y, r, color, m) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = {
        x:(Math.random() - 0.5) * 16,
        y:(Math.random() - 0.5) * 16
    };
    this.color = color;
    this.m = m;
    this.render = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
        c.closePath();
    }
    this.update = ballArray => {

        ballArray.forEach(
            ball => {
                if (ball != this) {
                    if (checkCollision(ball, this)) {
                        const _v1 = {x:ball.v.x, y:ball.v.y};
                        const _v2 = {x:this.v.x, y:this.v.y};
                        this.v = _v1;
                        ball.v = _v2;
                    }
                }
            }
        );
        if (this.x + this.r > innerWidth || this.x - this.r < 0)
            this.v.x *= -1;
        if (this.y + this.r > innerHeight || this.y - this.r < 0)
            this.v.y *= -1;
        this.x += this.v.x;
        this.y += this.v.y;
        this.render();
    }
}

var balls = [];
for (var i=0; i<60; i++) {
    const r = 20;
    let x = 2 * r + Math.random() * (innerWidth - 2 * r);
    let y = 2 * r + Math.random() * (innerHeight - 2 * r);
    const m = 1;
    let ball = new Ball(x, y, r, getRandomColor(), m);
    if (i !== 0) {
        for (var j = 0; j <balls.length; j++) {
            if (checkCollision(ball, balls[j])) {
                x = 2 * r + Math.random() * (innerWidth - 2 * r);
                y = 2 * r + Math.random() * (innerHeight - 2 * r);
                ball = new Ball(x, y, r, getRandomColor());
                j = -1;
            }
        }
        balls.push(ball);
    }
    else balls.push(ball);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    balls.forEach (
        ball => {
            ball.update(balls);
        }
    );
}

animate();