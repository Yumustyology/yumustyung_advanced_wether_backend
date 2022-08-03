const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schema/user.schema");
const { check, validationResult } = require("express-validator");

router.post("/", async (req, res) => {
//  const refreshToken = req.header("x-auth-token")
const refreshToken = req.body.refreshToken
console.log(refreshToken);
//  if refresh token is not provided
if(!refreshToken){
    res.status(401).json({
        errors:[{msg:"token not found"}]
    })
}else{
    try {
        const user = await JWT.verify(refreshToken,"YUMUSTYUNGWEATHERAPPREFRESHTOKENSALT")
        const {email} = user
        console.log(email);
        const accessToken = await JWT.sign({email},"YUMUSTYUNGWEATHERAPPSALT",{expiresIn:"10s"})
        console.log("new access ",accessToken);
        res.status(201).json({
            accessToken
        })
    } catch (error) {
        res.status(403).json({
            errors:[{
                message:"Invalid token"
            }]
        })
    }
}

// // if token does not exist send error
// if(!refreshToken)


});





module.exports = router