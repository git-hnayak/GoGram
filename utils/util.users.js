const UserModel = require('../models/model.users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const saltRound = 12;
const config = require('../config');

const findAllUsers = () => {
    return new Promise((resolve, reject) => {
        UserModel.find()
            .limit(10)
            .select({_id: 0, password: 0})
            .then(result => resolve(result))
            .catch((err) => {
                reject(err)
            });
    })
};

const getUserDetails = (id) => {
    return new Promise((resolve, reject) => {
        UserModel.findById(id)
            .select({_id: 0, password: 0, imagePath: 0, resetPasswordToken: 0, resetPasswordExpires: 0})
            .then(result => resolve(result))
            .catch((err) => {
                reject(err)
            });
    })
}

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email })
            .then(userDetails => resolve(userDetails))
            .catch((err) => {
                reject(err)
            });
    });
}

const checkUserExist = (email) => {
    return new Promise((resolve, reject) => {
        UserModel.countDocuments({ email })
            .then(count => {
                if (count != 0 ) {
                    reject('User already exist');
                } else {
                    resolve();
                }
            }).catch((err) => {
                reject(err)
            });
    })
}

const bcryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRound, (err, hash) => {
            if (err) {
                reject(err)
            } else {
                resolve(hash);
            }
        })
    })
}

const insertUser = (user) => {
    const userObj = new UserModel(user);
    return new Promise((resolve, reject) => {
        userObj.save()
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

const createUser = (req) => {
    const user = req.body;
    const file = req.file;
    user.imagePath = file.path;
    user.imageUrl = req.protocol + '://' + req.get('host') + '/' + file.filename;
    return new Promise((resolve, reject) => {
        checkUserExist(user.email)
        .then(() => {
            return bcryptPassword(user.password);
        })
        .then((hash) => {
            user.password = hash;
            return insertUser(user);
        })
        .then((res) => {
            //generate token
            const token = jwt.sign({id: res._id}, config.secret_key, {
                expiresIn: 86400
            });
            resolve(token);
        })
        .catch(error => {
            reject(error);
        }) 
    });
}

const comparepassword = (password, userDetails) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, userDetails.password)
        .then(res => {
            if (res) {
                resolve(userDetails)
            } else {
                reject({message: 'Invalid Password'});
            }
        })
        .catch(err => reject(err))
    })
}

const logUser = (req) => {
    const user = req.body;
    return new Promise((resolve, reject) => {
        findUserByEmail(user.email)
        .then((userDetails) => {
            if (userDetails) {
              return comparepassword(user.password, userDetails);
            } else {
                reject({message: 'No user found'});
            }
        })
        .then((userDetails) => {
            const token = jwt.sign({id: userDetails._id}, config.secret_key, {
                expiresIn: 86400
            });
            resolve(token);
        })
        .catch(err => reject(err))
    })
}

const updateUser = (req) => {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(req.userid, req.body)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}

const generatePasswordToken = (userDetails) => {
    return new Promise((resolve, reject) => {
        crypto.pseudoRandomBytes(20, function(err, raw) {
            if (err) reject(err);
            const token = raw.toString('hex');
            const user = {
                id: userDetails._id,
                resetPwdObj: {
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 3600000
                }
            }
            resolve(user);
        });
    })
}

const updateResetPasswordToken = (user) => {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(user.id, user.resetPwdObj, {new: true})
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}

const forgotUser = (req) => {
    return new Promise((resolve, reject) => {
        findUserByEmail(req.body.email)
        .then((userDetails) => {
            // console.log(userDetails);
            if (userDetails) {
              return generatePasswordToken(userDetails);
            } else {
                reject({message: 'No user found with provided email'});
            }
        })
        .then((user) => {
            return updateResetPasswordToken(user)
        })
        .then((user) => {
            resolve(user.resetPasswordToken); //We can send an email with this token for reseting password
        })
        .catch(err => reject(err))
    })
}

const verifyResetToken = (token) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (user) {
                resolve(user);
            } else {
                reject({message: 'Password reset token is invalid or has expired.'})
            }
        })
        .catch(err => reject(err))
    })
}

const updatePassword = (user) => {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(user.id, user.passwordObj)
        .then((res) => resolve(res))
        .catch(err => reject(err))
    })
}

const resetPassword = (req) => {
    const user = {};
    return new Promise((resolve, reject) => {
        verifyResetToken(req.params.token)
        .then((userDetails) => {
            user.id = userDetails._id;
            return bcryptPassword(req.body.password);
        })
        .then((hash) => {
            user.passwordObj = {
                password: hash,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
            return updatePassword(user)
        })
        .then((res) => {
            resolve(res)
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    findAllUsers: findAllUsers,
    createUser:  createUser,
    logUser: logUser,
    getUserDetails: getUserDetails,
    updateUser: updateUser,
    forgotUser: forgotUser,
    resetPassword: resetPassword
}