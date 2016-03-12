var Ball = require('./objects/ball')
var Food = require('./objects/food')
var $ = window.jQuery


/**
 * PlayField component class
 */
class PlayField {
	constructor(element, data) {

		this.el = element
		this.ctx = element.getContext('2d')

		this.images = {
			go: $(data.go).get(0)
		}

		this.player = new Ball()
		this.food = [
			new Food(this.images.go)
		]

		this.resize()

		$(window).on('resize', () => {this.resize()})

		this.force = {
			up: 0,
			left: 0,
			right: 0,
			down: 0
		}

		$(document).on('keydown', (e) => {
			switch (e.keyCode) {
				case 37:
					this.force.left = 1
					break
				case 38:
					this.force.up = 1
					break
				case 39:
					this.force.right = 1
					break
				case 40:
					this.force.down = 1
					break
			}
		})
		$(document).on('keyup', (e) => {
			switch (e.keyCode) {
				case 37:
					this.force.left = 0
					break
				case 38:
					this.force.up = 0
					break
				case 39:
					this.force.right = 0
					break
				case 40:
					this.force.down = 0
					break
			}
		})
		if (window.DeviceMotionEvent) {
			$(window).on('deviceorientation', (e) => {
				var max = 20
				var orientation = window.orientation
				var angle = {
					x: 0,
					y: 0
				}

				if (!orientation || window.orientation === 0) {
					angle.x = e.originalEvent.gamma
					angle.y = e.originalEvent.beta
				} else if (window.orientation === 180) {
					angle.x = -e.originalEvent.gamma
					angle.y = -e.originalEvent.beta
				} else if (window.orientation === 90) {
					angle.x = e.originalEvent.beta
					angle.y = -e.originalEvent.gamma
				} else if (window.orientation === -90) {
					angle.x = -e.originalEvent.beta
					angle.y = e.originalEvent.gamma
				}

				if (angle.x && angle.y) {
					if (angle.y > max) {
						angle.y = max
					} else if (angle.y < -max) {
						angle.y = -max
					}
					if (angle.x > max) {
						angle.x = max
					} else if (angle.x < -max) {
						angle.x = -max
					}
					if (angle.y < 0) {
						this.force.up = angle.y/(-max)
						this.force.down = 0
					} else {
						this.force.down = angle.y/max
						this.force.up = 0
					}
					if (angle.x < 0) {
						this.force.left = angle.x/(-max)
						this.force.right = 0
					} else {
						this.force.right = angle.x/max
						this.force.left = 0
					}
				}
			})
		}

		this.loop()
	}

	detectCollision() {
		for(let food of this.food) {
			if (Math.pow(this.player.getX()-food.getX(), 2)
					+ Math.pow(this.player.getY()-food.getY(), 2)
					< Math.pow(this.player.getRadius()+food.getRadius(), 2)) {
				// Collision detected
				this.player.addTail()
				this.placeFoodAtRandomPosition(food)
			}
		}
	}

	placeFoodAtRandomPosition(food) {
		food.setPosition(food.getRadius()+Math.random()*(this.el.width-2*food.getRadius()), food.getRadius()+Math.random()*(this.el.height-2*food.getRadius()))
	}

	resize() {
		var rect = this.el.getBoundingClientRect()
		this.el.width = rect.width
		this.el.height = rect.height

		this.player.setFrame(this.el.width, this.el.height)
		this.player.setPosition(this.el.width/2, this.el.height/2)

		for(let food of this.food) {
			this.placeFoodAtRandomPosition(food)
		}

		this.render()
	}

	loop() {
		this.player.pushLeft(this.force.left)
		this.player.pushUp(this.force.up)
		this.player.pushRight(this.force.right)
		this.player.pushDown(this.force.down)
		this.player.step()
		this.detectCollision()
		this.render()
		requestAnimationFrame(()=>{this.loop()})
	}

	render() {
		this.ctx.clearRect(0, 0, this.el.width, this.el.height)
		for(let food of this.food) {
			food.render(this.ctx)
		}
		this.player.render(this.ctx)
	}
}

module.exports = PlayField
