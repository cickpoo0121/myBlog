require('dotenv').config();
const router = require('express').Router();
const bcypt = require('bcrypt')
const con = require('../config/db')
const jwt = require('jsonwebtoken');

// Login
router.post('/mobile/login', (req, res) => {
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

                res.send(token);
            }
            else {
                res.status(400).send('Wrong username or password')
            }
        })

    })

})

module.exports = router;
