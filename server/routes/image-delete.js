const aws = require('aws-sdk');
const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');

const config = require('../config');

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: 'us-east-2'
});

const s3 = new aws.S3();

router.post('/image-delete', UserCtrl.authMiddleware, function(req, res) {
//console.log(req.body);
	var s3Files = [];

    function s3Key(link){
             var fileName = link.split('/').slice(-1)[0];
             return fileName;
            }
    for(var k in req.body){
            //console.log('Here are each files ' + req.body[k]);
             s3Files.push({Key : s3Key(req.body[k])});
            }

	var params = {
		Bucket: 'bwm-image-dev', 
		Delete: {
		Objects: s3Files, 
			Quiet: false
		}
	};

	s3.deleteObjects(params, function(err, data) {
		if (err) {
      			return res.status(422).send({errors: [{title: 'Delete Image Error', detail: err.message}]});
    			}
    	 return res.json({message: 'Images Deleted'});
  	});
});

module.exports = router;
