const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  email: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    unique: true,
    lowercase: true,
    required: 'Email is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    required: 'Password is required'
  },
  passwordActive: {type: Boolean, default: true},
  PasswordTry: {type: Number, default: 0},
  resetPasswordToken: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    default: null
  },
  resetPasswordExpires: {type: Date, default: Date.now},
  activationToken: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    default: null
  },
  activationTokenExpires: {type: Date, default: Date.now},
  accActivation: {type: Boolean, default: false},
  stripeCustomerId: String,
  revenue: Number,
  rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}],
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});

userSchema.methods.hasSamePassword = function(requestedPassword) {

  return bcrypt.compareSync(requestedPassword, this.password);
}


userSchema.pre('save', function(next) {
  const user = this;
console.log(user);

  console.log('password changed 1');
if (!user.isModified('password')) return next();
  console.log('password changed 2');
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        console.log(user.password);
        next();
    });
  });
});

module.exports = mongoose.model('User', userSchema );
