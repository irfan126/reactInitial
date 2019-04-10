const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const User = require('../models/user');
const NodeGeocoder = require('node-geocoder');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/filter', function(req, res) {
  const category = req.query.category;
   console.log('filter');
  console.log(req.query);
  const query = category ? {category: category.toLowerCase()} : {};

  Rental.where({adActive: true})
      .find(query)
      .select('-bookings')
      .exec(function(err, foundRentals) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (category && foundRentals.length === 0) {
      return res.status(422).send({errors: [{title: 'No Rentals Found!', detail: `There are no rentals for category ${category}`}]});
    }

    return res.json(foundRentals);
  });
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Rental
    .where({user})
    .populate('bookings')
    .exec(function(err, foundRentals) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundRentals);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Rental
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundRental) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundRental.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not rental owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const rentalId = req.params.id;

  Rental.findById(rentalId)
        .populate('user', 'username -_id')
        .populate('bookings', 'startAt endAt -_id')
        .exec(function(err, foundRental) {

    if (err || !foundRental) {
      return res.status(422).send({errors: [{title: 'Rental Error!', detail: 'Could not find Rental!'}]});
    }

    return res.json(foundRental);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  const rentalData = req.body;
  const user = res.locals.user;
console.log(rentalData);

const options = {
                  provider: 'google',
                   // Optional depending on the providers
                  httpAdapter: 'https', // Default
                  apiKey: 'AIzaSyDW9tFSqG2mA0ym2NluRBVGZ6tPr8xbwRM', // for Mapquest, OpenCage, Google Premier
                  formatter: null         // 'gpx', 'string', ...
    };

  const geocoder = NodeGeocoder(options);

  Rental
    .findById(req.params.id)
    .populate('user', '-password -passwordActive -PasswordTry -resetPasswordToken -activationToken -accActivation -rentals -bookings -username -email -password -activationTokenExpires -resetPasswordExpires')
    .exec(function(err, foundRental) {

      if (err) { return res.status(422).send({errors: normalizeErrors(err.errors)}); }

      if (foundRental.user.id !== user.id) { return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not rental owner!'}]}); }

      if (rentalData['adActive']) { rentalData['adActiveDate'] = Date.now();}
      foundRental.set(rentalData);
      if (rentalData['city'] || rentalData['street']) { 
            geocoder.geocode(`${foundRental.street}, ${foundRental.city} `, function(err, value){
                  if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                  if (value) {
                            if(!value.length > 0) { return res.status(422).send({errors: [{title: 'Location Error!', detail: 'Please enter a valid address!'}]});}
                             rentalData['latitude'] = value[0].latitude;
                             rentalData['longitude'] =value[0].longitude;

                             foundRental.set(rentalData);
                             console.log(foundRental);
                             foundRental.save(function(err) {
                                      if (err) { return res.status(422).send({errors: normalizeErrors(err.errors)}); }
                                      return res.status(200).send(foundRental);
                              });
                        }
                });
        } else {
                 foundRental.save(function(err) {
                     if (err) { return res.status(422).send({errors: normalizeErrors(err.errors)}); }
                    return res.status(200).send(foundRental);
                  });
        }
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Rental
    .findById(req.params.id)
    .populate('user', '_id')
    .populate({
      path: 'bookings',
      select: 'startAt',
      match: { startAt: { $gt: new Date()}}
    })
    .exec(function(err, foundRental) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (user.id !== foundRental.user.id) {
      return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not rental owner!'}]});
    }

    if (foundRental.bookings.length > 0) {
      return res.status(422).send({errors: [{title: 'Active Bookings!', detail: 'Cannot delete rental with active bookings!'}]});
    }

    foundRental.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});

router.post('', UserCtrl.authMiddleware, function(req, res) {
  const { title, city, street, category, image1, image2, image3, image4, image5, shared, bedrooms, description, dailyRate } = req.body;
 
  const options = {
                  provider: 'google',
                   // Optional depending on the providers
                  httpAdapter: 'https', // Default
                  apiKey: 'AIzaSyDW9tFSqG2mA0ym2NluRBVGZ6tPr8xbwRM', // for Mapquest, OpenCage, Google Premier
                  formatter: null         // 'gpx', 'string', ...
    };

  const geocoder = NodeGeocoder(options);

  geocoder.geocode(`${street}, ${city} `, function(err, value){
      if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
      if (value) {
                if(!value.length > 0) { return res.status(422).send({errors: [{title: 'Location Error!', detail: 'Please enter a valid address!'}]});}
                const latitude = value[0].latitude;
                const longitude =value[0].longitude;
                const user = res.locals.user;

                const rental = new Rental({title, city, street,  latitude, longitude, category, image1, image2, image3, image4, image5, shared, bedrooms, description, dailyRate});
                rental.user = user;

                Rental.create(rental, function(err, newRental) {
                      if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                      User.update({_id: user.id}, { $push: {rentals: newRental}}, function(){});
                        return res.json(newRental);
              }); 
        }
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
     console.log('searchInput');
     console.log(req.query);
  const query = city ? {city: city.toLowerCase()} : {};

  Rental.where({adActive: true})
      .find(query)
      .select('-bookings')
      .exec(function(err, foundRentals) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (city && foundRentals.length === 0) {
      return res.status(422).send({errors: [{title: 'No Rentals Found!', detail: `There are no rentals for city ${city}`}]});
    }

    return res.json(foundRentals);
  });
});

module.exports = router;


