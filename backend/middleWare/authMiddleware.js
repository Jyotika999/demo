import Jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import expressAsyncHandler from 'express-async-handler'

const protect = expressAsyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization 
        && req.headers.authorization
        .startsWith('Bearer')){

        try {
            token= req.headers.authorization.split(' ')[1]
            const decoded =Jwt.verify(token, process.env.JWT_SECRET)

            req.user= await User.findById(decoded.id).select('-password')

            return next()
            
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not Authorized, token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('NOT AUTHORIZED, no token') 
    }

    return next()
})

export {protect}