const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  title: { type: String, required: true, max: [128, 'Too long, max is 128 characters']},
  city: { type: String, required: true, lowercase: true },
  street: { type: String, required: true, min: [4, 'Too short, min is 4 characters']},
  latitude: Number,
  longitude: Number,
  category: { type: String, required: true, lowercase: true },
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  image4: { type: String, required: true },
  image5: { type: String, required: true },
  bedrooms: Number,
  shared: Boolean,
  adActive: {type: Boolean, default: true },
  adActiveDate: {type: Date, default: Date.now},
  description: { type: String, required: true },
  dailyRate: Number,
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});


module.exports = mongoose.model('Rental', rentalSchema );
