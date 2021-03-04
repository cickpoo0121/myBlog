// middlewar to varify user
const jwt = require('jsonwebtoken');
require('dotenv').config();

// const content = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

function checkUserMobile(req, res, next) {
    const token = req.headers['authorization'] || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                // when token is wrong
                console.log(err)
                res.status(400).send('Invalid token');
            }
            else {
                req.afterDecoded = decoded;
                next();
            }
        })
    }
    else {
        // no token, return to homepage
        res.status(400).send('Invalid token');

    }

}

module.exports = checkUserMobile;