const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
//import crypto from 'crypto';
const mailjet = require ('node-mailjet').connect(config.MJ_APIKEY_PUBLIC, config.MJ_APIKEY_PRIVATE)

exports.getUser = function(req, res) {
  const requestedUserId = req.params.id;
  const user = res.locals.user;

  if (requestedUserId === user.id) {
    User.findById(requestedUserId, function(err, foundUser) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json(foundUser);
    })

  } else {
    User.findById(requestedUserId)
      .select('-revenue -stripeCustomerId -password')
      .exec(function(err, foundUser) {
        if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.json(foundUser);
      })
  }
}

exports.auth =  function(req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
  }

  User.findOne({email}, function(err, user) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (!user) {
      return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong email address or password. Please try again!'}]});
    }

    if (user.accActivation){

                      if (!user.passwordActive) {
      return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'Your account has been locked. Please reset your password!'}]});
                                                }
                      if (user.hasSamePassword(password)) {
                                                const token = jwt.sign({
                                                                        userId: user.id,
                                                                        username: user.username
                                                                }, config.SECRET, { expiresIn: '1h'});

                                                  return res.json(token);
                          } else {
                                  if (user.PasswordTry > 2) {
                                    user.set({
                                              passwordActive: false
                                              });
                                    user.save(function(err) {
                                                              if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                                              return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Your account has been locked. Please reset your password!'}]});
                                                        })
                                    } else {
                                    user.set({
                                              PasswordTry: user.PasswordTry + 1
                                              });
                                    user.save(function(err) {
                                                              if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                                              return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong email address or password. Please try again!'}]});
                                                        })
                                    }
                          }
        } 
    else {
          const token = crypto.randomBytes(20).toString('hex');
          const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({"Messages":[{"From": {"Email": `registration@${config.APP_WEBLINK}`,"Name": `${config.APP_NAME}`},
                                            "To": [{//"Email": `${email}`,
                                                    "Email": 'irfan126@gmail.com',"Name":  `${user.username}`}],
                                            "Subject": "Link To Activate account",
                                            "TextPart": `Welcome to ${config.APP_NAME}!`,
                                            "HTMLPart": 'You are receiving this email because you (or someone else) have created account. <br /><br />'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:<br /><br />'
            + `${config.APP_URI}/activateaccount/${token}<br /><br />`
            + 'If you did not request this, please ignore this email.<br />',
                                      }]
                        })
                    request.then((result) => {
                                              //console.log(result.body);
                                              console.log('mailjet successful');
                                              user.set({
                                                          activationToken: token,
                                                          activationTokenExpires: Date.now() + 360000,
                                                          accActivation: false
                                                        });

                                              user.save(function(err) {
                                                                      if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                                  return res.status(422).send({errors: [{title: 'Invalid Acctivation!', detail: 'To complete registration please follow the activation link resent to your email address.'}]});
                                                                        })
                                })
                                .catch((err) => {//console.log(err.statusCode);
                                            console.log('mailjet errors');
                                            return res.status(422).send({errors: normalizeErrors(err.errors)});
                                            })
// return res.status(422).send({errors: [{title: 'Invalid Acctivation!', detail: 'There has been an error with your Activation request. Please request a new Activation link below!'}]});
    }
  });
}

exports.register =  function(req, res) {
  const { username, email, password, passwordConfirmation } = req.body;
  console.log(password);

  if (!password || !email || !username) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide username, email and password!'}]});
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({errors: [{title: 'Invalid passsword!', detail: 'Password is not a same as password confirmation!'}]});
  }

  User.findOne({email, username}, function(err, existingUser) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (!existingUser) {
          const token = crypto.randomBytes(20).toString('hex');
          const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({"Messages":[{"From": {"Email": `registration@${config.APP_WEBLINK}`,"Name": `${config.APP_NAME}`},
                                            "To": [{//"Email": `${email}`,
                                                    "Email": 'irfan126@gmail.com',"Name":  `${username}`}],
                                            "Subject": "Link To Activate account",
                                            "TextPart": `Welcome to ${config.APP_NAME}!`,
                                            "HTMLPart": 'You are receiving this email because you (or someone else) have created account. <br /><br />'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:<br /><br />'
            + `${config.APP_URI}/activateaccount/${token}<br /><br />`
            + 'If you did not request this, please ignore this email.<br />',
                                      }]
                        })
                    request.then((result) => {
                            //console.log(result.body);
                            console.log('mailjet successful');
                            const user = new User({
                                                    username,
                                                    email,
                                                    password,
                                                    activationToken: token,
                                                    activationTokenExpires: Date.now() + 360000
                                                  });

                             user.save(function(err) {
                                                      if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                                      return res.json({'To complete registration please follow the activation link sent to your email address.': true});
                                                      })
                                })
                                .catch((err) => {//console.log(err.statusCode);
                                            console.log('mailjet errors');
                                            return res.status(422).send({errors: normalizeErrors(err.errors)});
                                            })
      } 
      else {
        return res.status(422).send({errors: [{title: 'Invalid email!', detail: 'User with this email already exist!'}]});
      }
  })
}

exports.activateAcc =  function(req, res) {
  const {activationToken}  = req.body.params;
  console.log(req.body);

  if (!activationToken) {
    console.log('No token');
    return res.status(422).send({errors: [{title: 'Invalid Activation token!', detail: 'There has been an error with your Activation request. Please request a new Activation link below!'}]});
  }

  User.findOne({activationToken}, function(err, existingUser) {
        console.log('check for user');
    if (err) {
          console.log('check for user error');
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (existingUser) {
      console.log('user found');
            if (existingUser.activationTokenExpires > Date.now()) {
                      existingUser.set({
                              accActivation: true,
                              activationToken: null
                        });
                      existingUser.save(function(err) {
                            if (err) {
                                return res.status(422).send({errors: normalizeErrors(err.errors)});
                            }
                            return res.json({'Activation request successful! Please login with your credentials.': true});
                        })
            }
            else {   
              return res.status(422).send({errors: [{title: 'Invalid Acctivation token!', detail: 'Your Activation link has expired. Please request a new Activation link below!'}]});
            }
    } 
    else {
      return res.status(422).send({errors: [{title: 'Invalid Acctivation token!', detail: 'There has been an error with your Activation request. Please request a new Activation link below!'}]});
    }
  })
}

exports.activateAccReset =  function(req, res) {
  const { email } = req.body;
  if (!email) {return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide an email!'}]});}

  User.findOne({email}, function(err, existingUser) {
    if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
    if (existingUser) {
    if (existingUser.accActivation) {
      return res.status(422).send({errors: [{title: 'Invalid Activation!', detail: 'Your email address has already been verfied please login!'}]});
    }
        const token = crypto.randomBytes(20).toString('hex');
        const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({"Messages":[{"From": {"Email": `registration@${config.APP_WEBLINK}`,"Name": `${config.APP_NAME}`},
                                            "To": [{//"Email": `${email}`,
                                                    "Email": 'irfan126@gmail.com',"Name":  `${existingUser.username}`}],
                                            "Subject": "Link To Activate account",
                                            "TextPart": `Welcome to ${config.APP_NAME}!`,
                                            "HTMLPart": 'You are receiving this email because you (or someone else) have created account. <br /><br />'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:<br /><br />'
            + `${config.APP_URI}/activateaccount/${token}<br /><br />`
            + 'If you did not request this, please ignore this email.<br />',
                                      }]
                        })
                    request.then((result) => {
                            //console.log(result.body);
                            console.log('mailjet successful');
                            existingUser.set({
                                              activationToken: token,
                                              activationTokenExpires: Date.now() + 360000,
                                              accActivation: false
                                            });
                            existingUser.save(function(err) {
                                                              if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                      return res.json({'To complete registration please follow the activation link sent to your email address.': true});
                                                            })
                                })
                                .catch((err) => {//console.log(err.statusCode);
                                            console.log('mailjet errors');
                                            return res.status(422).send({errors: normalizeErrors(err.errors)});
                                            })
      }
    else {return res.status(422).send({errors: [{title: 'Invalid email!', detail: 'User with this email does not exist!'}]});}
    })
}

exports.updatePassword =  function(req, res) {
  const { resetPasswordToken, password, passwordConfirmation } = req.body;

  if (!password || !resetPasswordToken || !passwordConfirmation) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({errors: [{title: 'Invalid passsword!', detail: 'Password is not a same as password confirmation!'}]});
  }

  User.findOne({resetPasswordToken}, function(err, existingUser) {
    if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}

    if (existingUser) {
            existingUser.set({
                    resetPasswordToken: null,
                    passwordActive: true,
                    PasswordTry: 0,
                    password
              });

            existingUser.save(function(err) {
                  if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}

                  return res.json({'Password reset successfully! Please login with your credentials.': true});
              })
     }
     else {
      return res.status(422).send({errors: [{title: 'Invalid token!', detail: 'There has been an error with your password reset. Please try resetting your password again!'}]});
      }  
  })
}

exports.contactUsRequest =  function(req, res) {

  const { email, question } = req.body;
  if (!email || !question) {return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide an email and question!'}]});}
  const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({"Messages":[{"From": {"Email": `registration@${config.APP_WEBLINK}`,"Name": `${config.APP_NAME}`},
                                            "To": [{//"Email": `${email}`,
                                                    "Email": 'irfan126@gmail.com'}],
                                            "Subject": "Question",
                                            "TextPart": `Welcome to ${config.APP_NAME}!`,
                                            "HTMLPart": 'Question need a response. <br /><br />'
                                                      + `Question from email: ${email}<br /><br />`
                                                      + `Question: ${question}.<br /><br />`,
                                      }]
                        })
                    request.then((result) => {
                                                //console.log(result.body);
                                                console.log('mailjet successful');
                                                return res.json({'Question Submitted': true});
                                              })
                           .catch((err) => {//console.log(err.statusCode);
                                            console.log('mailjet errors');
                                            return res.status(422).send({errors: normalizeErrors(err.errors)});
                                           })
}

exports.passwordReset =  function(req, res) {
  const { email } = req.body;
  if (!email) {return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide an email!'}]});}

  User.findOne({email}, function(err, existingUser) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (!existingUser) {
      return res.status(422).send({errors: [{title: 'Invalid email!', detail: 'User with this email does not exist!'}]});
    }

    const token = crypto.randomBytes(20).toString('hex');
    const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({"Messages":[{"From": {"Email": `registration@${config.APP_WEBLINK}`,"Name": `${config.APP_NAME}`},
                                            "To": [{//"Email": `${email}`,
                                                    "Email": 'irfan126@gmail.com',"Name":  `${existingUser.username}`}],
                                            "Subject": "Link To Reset Password",
                                            "TextPart": `Welcome to ${config.APP_NAME}!`,
                                            "HTMLPart": 'You are receiving this because you (or someone else) have requested the reset of the password for your account. <br /><br />'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:<br /><br />'
            + `${config.APP_URI}/resetpassword/${token}<br /><br />`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.<br />',
                                      }]
                        })
                    request.then((result) => {
                            //console.log(result.body);
                            console.log('mailjet successful');
                            existingUser.set({ resetPasswordToken: token,
                                              resetPasswordExpires: Date.now() + 360000
                                              });
                            existingUser.save(function(err) {
                                              if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                              return res.json({'Password reset successfully! Please follow the link sent your email address.': true});
                                            })
                                })
                                .catch((err) => {//console.log(err.statusCode);
                                            console.log('mailjet errors');
                                            return res.status(422).send({errors: normalizeErrors(err.errors)});
                                            })
  })
}

exports.resetPassword =  function(req, res) {
  const {resetPasswordToken}  = req.body.params;

  if (!resetPasswordToken) {
    return res.status(422).send({errors: [{title: 'Invalid token!', detail: 'There has been an error with your password reset. Please try resetting your password again!'}]});
  }

  User.findOne({resetPasswordToken}, function(err, existingToken) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    if (!existingToken.resetPasswordExpires > Date.now()) {
      return res.status(422).send({errors: [{title: 'Invalid token!', detail: 'Your Password reset link has expired. Please request a new password link below!'}]});
    }
    if (existingToken) {

      const exisitngEmail = {resetPasswordToken};
      console.log(exisitngEmail);
      return res.json(exisitngEmail);
    } else {
      return res.status(422).send({errors: [{title: 'Invalid token!', detail: 'There has been an error with your password reset. Please try resetting your password again!'}]});
   }

  })
}

exports.authMiddleware = function(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    User.findById(user.userId, function(err, user) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (user) {
        res.locals.user = user;
        next();
      } else {
        return notAuthorized(res);
      }
    })
  } else {
    return notAuthorized(res);
  }
}

function parseToken(token) {
  return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res) {
  return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access!'}]});
}

