var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/employees');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log ("we're connected!")
});

var EventsSchema = mongoose.Schema({
  
name: {
	type: String,
	required: true,
	trim: true
},

location: {
	type: String,
	required: true,
	trim: true
},

date: {
	type: Date,
	required: true,
}

});

  var UserSchema = mongoose.Schema({
  
email: {
	type: String,
	unique: true,
	required: true,
	trim: true
},

name: {
	type: String,
	required: true,
	trim: true
},

password: {
	type: String,
	required: true,
}

});

  UserSchema.statics.authenticate = function(email, password, callback) {
  	User.findOne({ email: email})
  	.exec(function(error, user) {
  		if (error) {
  			return callback(error);
  		} else if ( !user ) {
  			var err = new Error('User Not Fount');
  			err.status = 401;
  			return callback(err);
  		}
      
  		bcrypt.compare(password, user.password, function(error, result) {
  			if (result === true) {
  				return callback(null, user);
  			} else {
  				return callback();
  			}
  		});
  	})
  }

  UserSchema.pre('save', function(next) {
  	var user = this;
  	bcrypt.hash(user.password, 10, function(err, hash) {
  		if (err) {
  			return next(err);
  		}
  		user.password = hash;
  		next();
  	})
  })

var User = mongoose.model('User', UserSchema);
var Events = mongoose.model('Events', ClientsSchema);

  
  module.exports = {
    db: db,
    User: User,
    EventsEvents: EventsEvents,
};