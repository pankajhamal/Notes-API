import jwt from "jsonwebtoken"
import "dotenv/config";
import {prisma} from "../config/db.js"

//Read the endpoint from the request
//Check if the token is valid

export const authMiddleware = async(req, res, next) =>{
  console.log("Auth middleware reached");

  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];

  } else if (req.cookies?.jwt){
    token = req.cookies.jwt;
  } 

  if(!token){
    return res.status(400).json({err: "Not authorized, no token provided"});
  }

  //Verify the token and extract the user id
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {id: decoded.id}
    })

    if(!user) {
      return res.status(401).json({err: "user no longer exist"});
    }

    req.user= user;
    next();

  } catch (err){
    return res.status(401).json({err: "Not authorized, token failed"})
  }
}