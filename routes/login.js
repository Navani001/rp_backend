const express =require('express');
const  {loginUser,loginemail}  = require('../controllers/logincontroller');
const router=express.Router();
router.post('/',loginUser)
router.post('/email',loginemail)
module.exports=router