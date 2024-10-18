const express = require ('express');
const router = express. Router ();
const bcrypt = require ( 'bcryptjs');
const db = require ('../config/db');

//render halaman register
router.get('/register', (req, res) => {
    res.render('register');
});

//proses register user
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync (password, 10);
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) throw err;
        res.redirect('/auth/login');
    });
});

//render halaman login
router.get('/login', (req, res) => {
    res.render('login');
});

//proses login user
router.post ('/login', (req, res) => {
    const { username, password } = req.body;

    const query ="SELECT * FROM users WHERE username =?";
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];

            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.redirect('/auth/profile');
            }
        } else {
            res.send('User not found');
        }
    });
});

//render halaman profil user
router.get ('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', {user: req.session});
    } else {
        res.redirect('/auth/login');
    }
});

//proses logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;