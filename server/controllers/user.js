const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
//import crypto from 'crypto';


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
          const transporter = nodeMailer.createTransport({
                                      service: 'gmail',
                                      auth: {
                                              user: `${config.GMAIL_USERNAME}`,
                                              pass: `${config.GMAIL_PASSWORD}`,
                                            },
                              });

        const mailOptions = {
                            from: `${config.GMAIL_USERNAME}`,
                            //to: `${user.email}`,
                            to: 'irfan126@gmail.com',
                            subject: 'Link To Activate account',
                            text:
            'You are receiving this because you (or someone else) have created account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `${config.APP_URI}/activateaccount/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                            };

        transporter.sendMail(mailOptions, (err, response) => {
                            if (err) {
                                      console.error('there was an error: ', err);
                                      return res.status(422).send({errors: normalizeErrors(err.errors)});
                                    } 
                            else {
                      console.log('here is the res: ', response);
                      //  res.status(200).json('recovery email sent');
                      user.set({
                                        activationToken: token,
                                        activationTokenExpires: Date.now() + 360000,
                                        accActivation: false
                                      });

                      user.save(function(err) {
                                                        if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                return res.status(422).send({errors: [{title: 'Invalid Acctivation!', detail: 'To complete registration please follow the activation link resent to your email address.'}]});
                                                      })
                                  }
                            });
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
          const transporter = nodeMailer.createTransport({
                                      service: 'gmail',
                                      auth: {
                                              user: `${config.GMAIL_USERNAME}`,
                                              pass: `${config.GMAIL_PASSWORD}`,
                                            },
                              });

        const mailOptions = {
                            from: `${config.GMAIL_USERNAME}`,
                            //to: `${email}`,
                            to: 'irfan126@gmail.com',
                            subject: 'Link To Activate account',
                            text:
            'You are receiving this because you (or someone else) have created account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `${config.APP_URI}/activateaccount/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                            };

        transporter.sendMail(mailOptions, (err, response) => {
                            if (err) {
                                      console.error('there was an error: ', err);
                                      return res.status(422).send({errors: normalizeErrors(err.errors)});
                                    } 
                            else {
                                  console.log('here is the res: ', response);
                                  const user = new User({
                                                          username,
                                                          email,
                                                          password,
                                                          activationToken: token,
                                                          activationTokenExpires: Date.now() + 360000
                                                      });

                                  user.save(function(err) {
                                                            if (err) {
                                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                                                                      }
                                                          return res.json({'To complete registration please follow the activation link sent to your email address.': true});
                                                          })
                                  }
                            });
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
        const transporter = nodeMailer.createTransport({
                                              service: 'gmail',
                                                  auth: {
                                                          user: `${config.GMAIL_USERNAME}`,
                                                          pass: `${config.GMAIL_PASSWORD}`,
                                                        },
                                              });
        const mailOptions = {
                              from: `${config.GMAIL_USERNAME}`,
                              //to: `${email}`,
                              to: 'irfan126@gmail.com',
                              subject: 'Link To Activate account',
                              text:
                'You are receiving this because you (or someone else) have created account.\n\n'
                + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                + `${config.APP_URI}/activateaccount/${token}\n\n`
                + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                            };

        transporter.sendMail(mailOptions, (err, response) => {
              if (err) {
                      console.error('there was an error: ', err);
                      return res.status(422).send({errors: normalizeErrors(err.errors)});
              } else {
                      console.log('here is the res: ', response);
                      //  res.status(200).json('recovery email sent');
                      existingUser.set({
                                        activationToken: token,
                                        activationTokenExpires: Date.now() + 360000,
                                        accActivation: false
                                      });

                      existingUser.save(function(err) {
                                                        if (err) {return res.status(422).send({errors: normalizeErrors(err.errors)});}
                                return res.json({'To complete registration please follow the activation link sent to your email address.': true});
                                                      })
                      }
          });
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
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (existingUser) {

            existingUser.set({
                    resetPasswordToken: null,
                    passwordActive: true,
                    PasswordTry: 0,
                    password
              });

            existingUser.save(function(err) {
                  if (err) {
                      return res.status(422).send({errors: normalizeErrors(err.errors)});
                  }

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

    const transporter = nodeMailer.createTransport({
            service: 'gmail',
                auth: {
              user: `${config.GMAIL_USERNAME}`,
              pass: `${config.GMAIL_PASSWORD}`,
            },
        });

        const mailOptions = {
          from: `${config.GMAIL_USERNAME}`,
          //to: `${email}`,
          to: 'irfan126@gmail.com',
          subject: 'Question',
          text:
            'Question need a response.\n\n'
            + `Question from email: ${email}\n\n`
            + `Question: ${question}.\n`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
                  return res.status(422).send({errors: normalizeErrors(err.errors)});
          } else {
                  return res.json({'Question Submitted': true});
                }
        });
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
    const transporter = nodeMailer.createTransport({
            service: 'gmail',
                auth: {
              user: `${config.GMAIL_USERNAME}`,
              pass: `${config.GMAIL_PASSWORD}`,
            },
        });

        const mailOptions = {
          from: `${config.GMAIL_USERNAME}`,
          //to: `${email}`,
          to: 'irfan126@gmail.com',
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `${config.APP_URI}/resetpassword/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
                  return res.status(422).send({errors: normalizeErrors(err.errors)});
          } else {
            console.log('here is the res: ', response);
          //  res.status(200).json('recovery email sent');

                existingUser.set({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 360000
    });

    existingUser.save(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'Password reset successfully! Please follow the link sent your email address.': true});
    })
          }
        });
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

