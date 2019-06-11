const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const User = require('../models/user');
const NodeGeocoder = require('node-geocoder');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');


const aws = require('aws-sdk');
const config = require('../config');
aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: 'us-east-2'
});
const s3 = new aws.S3();

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
      return res.status(422).send({errors: [{title: 'No Courses Found!', detail: `There are no Courses for category ${category}`}]});
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
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not course owner!'}]});
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
      return res.status(422).send({errors: [{title: 'Course Error!', detail: 'Could not find Course!'}]});
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

      if (foundRental.user.id !== user.id) { return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not course owner!'}]}); }

      if (rentalData['adActive']) { rentalData['adActiveDate'] = Date.now();}
      foundRental.set(rentalData);
      if (rentalData['postcode'] || rentalData['street']) { 
            geocoder.geocode(`${foundRental.street}, ${foundRental.postcode} `, function(err, value){
                  if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                  if (value) { console.log(value);
                            if(!value.length > 0) { return res.status(422).send({errors: [{title: 'Location Error!', detail: 'Please enter a valid address!'}]});}
                             rentalData['latitude'] = value[0].latitude;
                             rentalData['longitude'] =value[0].longitude;
                             rentalData['city'] =value[0].city;

                             foundRental.set(rentalData);
                            // console.log(foundRental);
                             foundRental.save(function(err) {
                                      if (err) { return res.status(422).send({errors: normalizeErrors(err.errors)}); }
                                      return res.status(200).send(foundRental);
                              });
                        }
                });
        } else {
                 foundRental.save(function(err) {
                   //console.log(foundRental);
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

    if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}

    if (user.id !== foundRental.user.id) {return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not the course owner!'}]});}

    if (foundRental.bookings.length > 0) {return res.status(422).send({errors: [{title: 'Active Bookings!', detail: 'Cannot delete course with active bookings!'}]});}

    foundRental.remove(function(err) {
      if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}

        var s3Files = [];
        function s3Key(link){ var fileName = link.split('/').slice(-1)[0];
                              return fileName;
                            }
        if (foundRental.image1 !== 'none') {s3Files.push({Key : s3Key(foundRental.image1)});}
        if (foundRental.image2 !== 'none') {s3Files.push({Key : s3Key(foundRental.image2)});}
        if (foundRental.image3 !== 'none') {s3Files.push({Key : s3Key(foundRental.image3)});}
        if (foundRental.image4 !== 'none') {s3Files.push({Key : s3Key(foundRental.image4)});}
        if (foundRental.image5 !== 'none') {s3Files.push({Key : s3Key(foundRental.image5)});}
        if (s3Files.length > 0){
                          var params = {Bucket: 'bwm-image-dev', Delete: {Objects: s3Files, Quiet: false}};
                          s3.deleteObjects(params, function(err, data) {
                              if (err) {return res.status(422).send({errors: [{title: 'Delete Image Error', detail: err.message}]});}
                                 return res.json({'status': 'deleted and Images deleted'});
                              });
                        } 
          else {return res.json({'status': 'deleted'}); }
    });
  });
});

router.post('', UserCtrl.authMiddleware, function(req, res) {
  const { title, postcode, street, category, image1, image2, image3, image4, image5, description, dailyRate, emailContact, phone, weblink } = req.body;
 console.log(phone);
  const options = {
                  provider: 'google',
                   // Optional depending on the providers
                  httpAdapter: 'https', // Default
                  apiKey: 'AIzaSyDW9tFSqG2mA0ym2NluRBVGZ6tPr8xbwRM', // for Mapquest, OpenCage, Google Premier
                  formatter: null         // 'gpx', 'string', ...
    };

  const geocoder = NodeGeocoder(options);

  geocoder.geocode(`${street}, ${postcode} `, function(err, value){
      if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
      if (value) {
                if(!value.length > 0) { return res.status(422).send({errors: [{title: 'Location Error!', detail: 'Please enter a valid address!'}]});}
                const latitude = value[0].latitude;
                const longitude =value[0].longitude;
                const city =value[0].city;
                const user = res.locals.user;

                const rental = new Rental({title, postcode, city, street,  latitude, longitude, category, image1, image2, image3, image4, image5, description, dailyRate, emailContact, phone, weblink});
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
var query = {};

if (city){ 
    var andArray = [];
    var searchTerms = city.split(" ");
         searchTerms.forEach(function(searchTerm) {
         andArray.push( {city: { $regex: searchTerm, $options:'i' }}, { title: { $regex: searchTerm, $options:'i' }}  );
          });
        query = andArray;
        }
        
  Rental.where({adActive: true})
      .find().or(query)
      .select('-bookings')
      .exec(function(err, foundRentals) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (city && foundRentals.length === 0) {
      return res.status(422).send({errors: [{title: 'No Courses Found!', detail: `There are no courses for ${city}`}]});
    }

    return res.json(foundRentals);
  });
});

module.exports = router;


