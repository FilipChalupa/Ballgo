var Circle = require('./circle')

class Tail extends Circle {
	constructor(x, y, color) {
		super()
		this.radius = 15
		this.color = this.darken(color)
		this.x = x
		this.y = y

		this.tail = false
	}

	darken(hex) {
		var lum = -0.1
		hex = hex.substr(1)

		var rgb = "#", c, i
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16)
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
			rgb += ("00"+c).substr(c.length)
		}
		return rgb
	}

	addTail(x, y, color) {
		if (this.tail) {
			this.tail.addTail(x, y, this.color)
		} else {
			this.tail = new Tail(x, y, color)
		}
	}

	follow(x, y) {
		this.x += (x-this.x)/3
		this.y += (y-this.y)/3

		if (this.tail) {
			this.tail.follow(this.x, this.y)
		}
	}
}

module.exports = Tail
