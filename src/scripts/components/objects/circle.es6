class Circle {
	constructor() {
		// this.radius, this.color
		this.x = 50
		this.y = 50
	}

	setPosition(x, y) {
		this.x = x
		this.y = y
	}

	getX() {
		return this.x
	}

	getY() {
		return this.y
	}

	getRadius() {
		return this.radius
	}

	render(context) {
		if (this.tail) {
			this.tail.render(context)
		}
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
		context.fillStyle = this.color
		context.fill()
	}
}

module.exports = Circle
