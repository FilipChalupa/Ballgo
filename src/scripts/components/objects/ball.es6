var Circle = require('./circle')
var Tail = require('./tail')

class Ball extends Circle {
	constructor() {
		super()
		this.radius = 25
		this.color = this.randomColor()
		this.field = {
			width: 100,
			height: 100
		}
		this.friction = 1
		this.acceleration = 2
		this.speed = {
			x: 0,
			y: 0
		}
		this.tail = false
	}

	pushLeft(power) {
		this.speed.x -= power * this.acceleration
	}
	pushUp(power) {
		this.speed.y -= power * this.acceleration
	}
	pushRight(power) {
		this.speed.x += power * this.acceleration
	}
	pushDown(power) {
		this.speed.y += power * this.acceleration
	}

	addTail(x, y) {
		if (this.tail) {
			this.tail.addTail(x, y, this.color)
		} else {
			this.tail = new Tail(x, y, this.color)
		}
	}

	randomColor() {
		var color = [
			((1<<8)*Math.random()|0).toString(16),
			'ff',
			'00'
		]
		for (var i = 0; i < 3; i++) {
			var x = color[i]
			var newI = Math.floor(Math.random()*3)
			color[i] = color[newI]
			color[newI] = x
		}
		return '#'+color[0]+color[1]+color[2]
	}

	step() {

		// Friction
		if (this.speed.x > 0) {
			this.speed.x -= this.friction
			if (this.speed.x < 0) {
				this.speed.x = 0
			}
		} else {
			this.speed.x += this.friction
			if (this.speed.x > 0) {
				this.speed.x = 0
			}
		}
		if (this.speed.y > 0) {
			this.speed.y -= this.friction
			if (this.speed.y < 0) {
				this.speed.y = 0
			}
		} else {
			this.speed.y += this.friction
			if (this.speed.y > 0) {
				this.speed.y = 0
			}
		}

		// Accelerate
		this.x += this.speed.x
		this.y += this.speed.y

		// Wall bounce
		if (this.x-this.radius < 0) {
			this.x = this.x+this.radius
			this.speed.x *= -1
		} else if (this.x+this.radius > this.field.width) {
			this.x = this.x-this.radius
			this.speed.x *= -1
		}
		if (this.y-this.radius < 0) {
			this.y = this.y+this.radius
			this.speed.y *= -1
		} else if (this.y+this.radius > this.field.height) {
			this.y = this.y-this.radius
			this.speed.y *= -1
		}

		// Tail follows
		if (this.tail) {
			this.tail.follow(this.x, this.y)
		}
	}

	setFrame(width, height) {
		this.field.width = width
		this.field.height = height
	}
}

module.exports = Ball
