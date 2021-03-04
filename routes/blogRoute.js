const router = require('express').Router();
const checkUser = require('./checkUser')
const con = require('../config/db')

// Blog
router.get('/blog', checkUser, (req, res) => {

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
            res.render('blog', { userInfo: req.afterDecoded, year: years, post: blogs });
        })
    })


})

// blog for selected year
router.get('/blog/:year', checkUser, (req, res) => {
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
            res.render('blog', { userInfo: req.afterDecoded, year: years, post: blogs, currentYear: year });
        })
    })


})

// delete blog
router.delete('/blog/:id', checkUser, (req, res) => {
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
        res.send('/blog')
    })
})

// add new blog
router.post('/blog/new', checkUser, (req, res) => {
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
        res.send('/blog')
    })

})

// edit blog
router.put('/blog/edit', checkUser, (req, res) => {
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
        res.send('/blog')
    })

})

// testPromis(token).then((val) => {
//     if (val !== null) {
//         res.send(val)
//     }
//     else {
//         res.send('/')
//     }
// })

// const years = [2021, 2020, 2019];
// const posts = [
//     { title: "Today", detail: "Snow", year: 2021 },
//     { title: "Tomorrow", detail: "Hot", year: 2020 },
//     { title: "Yesterday", detail: "rainny", year: 2019 }
// ]
// console.log(req.afterDecoded)

module.exports = router;