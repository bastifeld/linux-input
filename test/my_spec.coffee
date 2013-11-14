
describe "A suite", ->

	it "contains spec with an expectation", ->
		Keyboard = require '../lib/coffee/input.coffee'

		expect(true).toBe(true) 
		expect(Keyboard.KEYS.KEY_ESC).toBe(1)

		