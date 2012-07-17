YUI().use('node', 'event', function(Y) {
	function init() {
		var user = {};
		var MR = Math.random;
		var USIZE = 8;
		var MSIZE = 8;
		var W = 900;
		var H = 500;
		var border = 5;
		var ctx = {};

		var c = document.getElementById('playArea');
		ctx = c.getContext('2d');

		//Initial X & Y cooridinates for the user
		user.x = MR() * (W - (2 * border)) | 0;
		user.y = MR() * (H - (2 * border)) | 0;
		ctx.strokeRect(user.x, user.y, USIZE, USIZE);

		Y.Event.define("move", {
			// Webkit and IE repeat keydown when you hold down arrow keys.
			// Opera links keypress to page scroll; others keydown.
			// Firefox prevents page scroll via preventDefault() on either
			// keydown or keypress.
			_event: (Y.UA.webkit || Y.UA.ie) ? 'keydown' : 'keypress',

			_keys: {
				'37': 'left',
				'38': 'up',
				'39': 'right',
				'40': 'down'
			},

			_keyHandler: function(e, notifier) {
				if (this._keys[e.keyCode]) {
					e.direction = this._keys[e.keyCode];
					notifier.fire(e);
				}
			},

			on: function(node, sub, notifier) {
				// Use the extended subscription signature to set the 'this' object
				// in the callback and pass the notifier as a second parameter to
				// _keyHandler
				sub._detacher = node.on(this._event, this._keyHandler, this, notifier);
			},

			detach: function(node, sub, notifier) {
				sub._detacher.detach();
			},

			// Note the delegate handler receives a fourth parameter, the filter
			// passed (e.g.) container.delegate('click', callback, '.HERE');
			// The filter could be either a string or a function.
			delegate: function(node, sub, notifier, filter) {
				sub._delegateDetacher = node.delegate(this._event, this._keyHandler, filter, this, notifier);
			},

			// Delegate uses a separate detach function to facilitate undoing more
			// complex wiring created in the delegate logic above.  Not needed here.
			detachDelegate: function(node, sub, notifier) {
				sub._delegateDetacher.detach();
			}
		});
		
		function transition(oldX, oldY, newX, newY) {
			//FIXME Remove a bigger area to ensure that the full rectangle is removed
			ctx.clearRect(oldX - 5, oldY - 5, USIZE + 10 , USIZE + 10);
			ctx.strokeRect(newX, newY, USIZE, USIZE);
		}

		function move(e) {
			e.preventDefault();
			var x = 0, y = 0;
			switch (e.direction) {
				case 'up': transition(user.x, user.y, user.x, user.y - USIZE); user.y -= USIZE; break;
				case 'down': transition(user.x, user.y, user.x, user.y + USIZE); user.y += USIZE; break;
				case 'left': transition(user.x, user.y, user.x - USIZE, user.y); user.x -= USIZE; break;
				case 'right': transition(user.x, user.y, user.x + USIZE, user.y); user.x += USIZE; break;
			}

			console.log("Move " + e.direction);
		}

		Y.one("body").on("move", move);
	}


	Y.on('domready', function(e) {
		init();
	});
});