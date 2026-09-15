import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    let token = req.headers.authorization;
    
    if(!token){
        return res.json({success: false, message: "not authorized - no token"})
    }

    // Remove "Bearer " if present
    if(token.startsWith("Bearer ")){
        token = token.slice(7, token.length)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // decoded is { id: userId } from our fixed userController
        const userId = decoded.id || decoded._id || decoded;

        const user = await User.findById(userId).select("-password")
        
        if(!user){
            return res.json({success: false, message: "not authorized - user not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Auth error:", error.message);
        return res.json({success: false, message: "not authorized - invalid token"})
    }
}