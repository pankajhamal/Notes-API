import {prisma} from '../config/db.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../utills/generateToken.js'

const register = async (req, res) =>{
  const {name, email, password} = req.body;

  if(!name || !email || !password){
    return res.status(400).json({message: "All field are required"});
  }

  const userExist = await prisma.user.findUnique({
    where: {email}
  })

  if(userExist){
    return res.status(200).json({message: "User already exist"});
  }
  
  //Password Hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id, res);

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
}

const login = async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).json({message: "All fields are required"});
  }
  
  const userExist = await prisma.user.findUnique({
    where: {email}
  })

  //handle non existent account 
  if(!userExist){
    return res.status(401).json({errorMessage: "Incorrect email or password"});
  }

  const correctPassword = await bcrypt.compare(password, userExist.password);

  if(!correctPassword) {
    return res.status(401).json({errorMessage: "Incorrect email or password"});
  }

  const token = generateToken(userExist.id, res);


  return res.status(200).json({
    status: "Login Successful",
    data: {
      user: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email
      }
    },
    token,
  })

}

const logout = async (req, res) =>{
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({
    status: "successful",
    message: "Logged out successful",
  })
}

export {register, login, logout}