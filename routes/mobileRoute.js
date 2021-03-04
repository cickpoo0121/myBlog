require('dotenv').config();
const router = require('express').Router();
const bcypt = require('bcrypt')
const con = require('../config/db')
const jwt = require('jsonwebtoken');
const checkUserMobile = require('./checkUserMobile')


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

});

// Blog
router.get('/mobile/blog', checkUserMobile, (req, res) => {

    let sql = 'SELECT DISTINCT year FROM blog WHERE userID=? ORDER BY year DESC'
    con.query(sql, [req.afterDecoded.userID], (err, years) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Database error')
        }

        sql = 'SELECT blogID , title , detail, year FROM blog WHERE userID=? ORDER BY year DESC'
        con.query(sql, [req.afterDecoded.userID], (err, blogs) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Database error')
            }
            console.log(req.afterDecoded)
            res.json({ userInfo: req.afterDecoded, year: years, post: blogs })

            // res.render('blog', { userInfo: req.afterDecoded, year: years, post: blogs });
        })
    })
})

// blog for selected year
router.get('/mobile/blog/:year', checkUserMobile, (req, res) => {
    const year = req.params.year

    let sql = 'SELECT DISTINCT year FROM blog WHERE userID=? ORDER BY year DESC'
    con.query(sql, [req.afterDecoded.userID], (err, years) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Database error')
        }

        sql = 'SELECT blogID , title , detail, year FROM blog WHERE userID=? AND year= ? ORDER BY year DESC'

        con.query(sql, [req.afterDecoded.userID, year], (err, blogs) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Database error')
            }
            res.json({ userInfo: req.afterDecoded, year: years, post: blogs, currentYear: year });
        })
    })


})

// delete blog
router.delete('/mobile/blog/:id', checkUserMobile, (req, res) => {
    const blogID = req.params.id;
    const sql = 'DELETE FROM blog WHERE blogID=?';
    con.query(sql, [blogID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Database error')
        }
        if (result.affectedRows != 1) {
            return res.status(500).send('Delete failed')
        }
        res.send('Delecte Success')
    })
})

// add new blog
router.post('/mobile/blog/new', checkUserMobile, (req, res) => {
    const { title, detail } = req.body;
    const year = new Date().getFullYear();
    const sql = "INSERT INTO `blog` ( `title`, `detail`, `year`, `userID`) VALUES (?, ?, ?, ?);"

    con.query(sql, [title, detail, year, req.afterDecoded.userID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Database error')
        }
        if (result.affectedRows != 1) {
            return res.status(500).send('Delete failed')
        }
        res.send('Add Success')
    })

})

// edit blog
router.put('/mobile/blog/edit', checkUserMobile, (req, res) => {
    const { title, detail, blogID } = req.body;
    const sql = "UPDATE `blog` SET `title` = ?, `detail` = ? WHERE `blogID` = ?;"

    con.query(sql, [title, detail, blogID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Database error')
        }
        if (result.affectedRows != 1) {
            return res.status(500).send('Delete failed')
        }
        res.send('Edit Success')
    })

})

module.exports = router;
