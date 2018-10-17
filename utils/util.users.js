const UserModel = require('../models/model.users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRound = 12;

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
            resolve(res);
        })
        .catch(error => {
            reject(error);
        }) 
    });
}

module.exports = {
    findAllUsers: findAllUsers,
    createUser:  createUser
}