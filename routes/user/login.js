const express = require('express');
const router = express.Router();
const Login = require("../../controllers/user/login.controller")


//login
router.post('/',Login.login)
//get me เช็ค token
router.get('/getme/',Login.getme)

module.exports = router;