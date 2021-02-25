require('dotenv').config();
const router = require('express').Router();
const bcypt = require('bcrypt')
const con = require('../config/db')
const jwt = require('jsonwebtoken');

// generate password
router.get('/password/:pass', (req, res) => {
    const pass = req.params.pass

    bcypt.hash(pass, 10, (err, hash) => {
        if (err) {
            console.log(err)
            res.send(500).send('Hashing error')
        }
        else {
            res.send(hash)
        }
    })
})

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT userID,password FROM user WHERE username=?'
    con.query(sql, [username], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Server error')
        }
        if (result.length != 1) {
            return res.status(400).send('Username does not exist')
        }

        // check password
        bcypt.compare(password, result[0].password, (err, same) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Authen server error')
            }

            if (same) {
                const playload = { userID: result[0].userID, username: username };
                const token = jwt.sign(playload, process.env.JWT_KEY, { expiresIn: '1d' })

                const cookieOption = {
                    maxAge: 24 * 60 * 60 * 1000,//ms
                    httpOnly: true,
                    signed: true,
                }
                res.cookie('cookieMilk', token, cookieOption)
                res.send('/blog')
            }
            else {
                res.status(400).send('Wrong username or password')
            }
        })

    })

})

// Logout
router.get('/logout', (req, res) => {
    // remove cookie
    res.clearCookie('cookieMilk')
    res.redirect('/');
})

//create JWT
router.get('/jwt', (req, res) => {
    // res.send(process.env.JWT_KEY)
    const playload = { userID: 1, username: 'admin' };
    const token = jwt.sign(playload, process.env.JWT_KEY, { expiresIn: '1d' })
    res.send(token)
})

module.exports = router;