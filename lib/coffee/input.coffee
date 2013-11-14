
fs = require('fs') 

EventEmitter = require('events').EventEmitter
KEYS = require('./key_codes')


EV_KEY = 1
EVENT_TYPES = ['keyup','keypress','keydown']

	 
class Keyboard extends EventEmitter
	
		
	constructor: (dev) -> 	    
		
		@dev = dev
		@bufferSize = 24
		@buf = new Buffer(@bufferSize);    
		fs.open('/dev/input/' + @dev, 'r', (err,fd) => @onOpen(fd) )


	startRead: () ->
		fs.read(@fd, @buf, 0, @bufferSize, null, (bytesRead) => @onRead(bytesRead))


	onOpen: (fd) -> 
		console.log("onOpen : #{@dev}");
		@fd = fd
		@startRead() 
	

	onRead: (bytesRead) ->    
		event = @parse(@buf);
		if event 
			event.dev = @dev;      
			@emit(event.type, event);
		
		if @fd
			@startRead()



	close: (callback)  ->
		fs.close(@fd, () ->
			console.log("close")
		)
		@fd = null;


	parse: (buffer) ->
	
		if buffer.readUInt16LE(8) is EV_KEY  
			event = 
				# timeS: buffer.readUInt64LE(0)
				# timeMS: buffer.readUInt64LE(4)
				keyCode: buffer.readUInt16LE(10)

			event.keyName = @findKeyName(event.keyCode);
			event.keyId = event.keyCode;
			event.type = EVENT_TYPES[ buffer.readUInt32LE(12) ];
			return event;
		else
			return null

	findKeyID: (keyCode) ->
		for name, code of KEYS
			if code == keyCode
				return name

		console.log "keycode  #{keyCode} but return null"
		return null;
		


Keyboard.KEYS = KEYS


module.exports = Keyboard