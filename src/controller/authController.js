import {prisma} from '../config/db.js'
import bcrypt from 'bcryptjs'

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

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
}

export {register}