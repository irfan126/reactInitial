const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  title: { type: String, required: true, max: [128, 'Too long, max is 128 characters']},
  city: { type: String, required: true, lowercase: true },
  street: { type: String, required: true, min: [4, 'Too short, min is 4 characters']},
  postcode: { type: String, required: true, min: [4, 'Too short, min is 4 characters']},
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
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    emailContact: { type: String, required: true, min: [4, 'Too short, min is 4 characters'], max: [32, 'Too long, max is 32 characters'],lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is not Valid']},
    weblink: { type: String, min: [4, 'Too short, min is 4 characters'], max: [32, 'Too long, max is 32 characters'],lowercase: true,
    match: [/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, 'Valid weblink is required']},
    phone: {type: Number, default: null}
});


module.exports = mongoose.model('Rental', rentalSchema );
