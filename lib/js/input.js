(function() {
  var EVENT_TYPES, EV_KEY, EventEmitter, KEYS, Keyboard, fs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  EventEmitter = require('events').EventEmitter;

  KEYS = require('./key_codes');

  EV_KEY = 1;

  EVENT_TYPES = ['keyup', 'keypress', 'keydown'];

  Keyboard = (function(_super) {
    __extends(Keyboard, _super);

    function Keyboard(dev) {
      var _this = this;
      this.dev = dev;
      this.bufferSize = 24;
      this.buf = new Buffer(this.bufferSize);
      fs.open('/dev/input/' + this.dev, 'r', function(err, fd) {
        return _this.onOpen(fd);
      });
    }

    Keyboard.prototype.startRead = function() {
      var _this = this;
      return fs.read(this.fd, this.buf, 0, this.bufferSize, null, function(bytesRead) {
        return _this.onRead(bytesRead);
      });
    };

    Keyboard.prototype.onOpen = function(fd) {
      console.log("onOpen : " + this.dev);
      this.fd = fd;
      return this.startRead();
    };

    Keyboard.prototype.onRead = function(bytesRead) {
      var event;
      event = this.parse(this.buf);
      if (event) {
        event.dev = this.dev;
        this.emit(event.type, event);
      }
      if (this.fd) {
        return this.startRead();
      }
    };

    Keyboard.prototype.close = function(callback) {
      fs.close(this.fd, function() {
        return console.log("close");
      });
      return this.fd = null;
    };

    Keyboard.prototype.parse = function(buffer) {
      var event;
      if (buffer.readUInt16LE(8) === EV_KEY) {
        event = {
          keyCode: buffer.readUInt16LE(10)
        };
        event.keyName = this.findKeyName(event.keyCode);
        event.keyId = event.keyCode;
        event.type = EVENT_TYPES[buffer.readUInt32LE(12)];
        return event;
      } else {
        return null;
      }
    };

    Keyboard.prototype.findKeyID = function(keyCode) {
      var code, name;
      for (name in KEYS) {
        code = KEYS[name];
        if (code === keyCode) {
          return name;
        }
      }
      console.log("keycode  " + keyCode + " but return null");
      return null;
    };

    return Keyboard;

  })(EventEmitter);

  Keyboard.KEYS = KEYS;

  module.exports = Keyboard;

}).call(this);
