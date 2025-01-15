import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { compare, hash } from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken"
import { verifyToken } from "../utils/verifyToken";

const signIn = async (req: Request, res: Response) => {
  console.log("in sign in")
  try {
    const { email, password } = req.body;
    console.log("data", email, password);

    // ✅ Validate input
    if (!email || !password) {
       res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return
    }

    // ✅ Check if user already exists
    const userExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExist) {
       res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
      return
    }

    // ✅ Hash the password
    const hashedPassword = await hash(password, 10);

    // ✅ Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // ✅ Send success response
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const loginUser = async(req:Request, res:Response)=>{
    try {
        const {email, password} = req.body;
        console.log(email, password)
        if(!email || !password){
            res.status(400).json({
                success:false,
                message:"All fields are required"
            })
            return
        }
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        console.log(user)
        if(!user){
            res.status(400).json({
                success:false,
                message:"User not found"
            })
            return
        }
        const isMatch = await compare(password, user.password);
        console.log(isMatch)

        if(!isMatch){
            res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
            return
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        console.log(token)

        res.status(200).json({
            success:true,
            message:"Login successful",
            token
        })
return

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
        
    }
}
const getUser = async(req:Request, res:Response)=>{
  try {
    console.log("in get user")
    const token = req.headers.authorization?.split(" ")[1]
    const currUser = verifyToken(token as string)
    console.log("in get curr", currUser)
    if(currUser === null){
      res.status(400).json({
        success:false,
        message:"User not found"
      })
      return;
    }
    if (currUser && typeof currUser === 'object' && 'exp' in currUser) {
      if ((currUser.exp as number) < Date.now() / 1000) {
        res.status(400).json({
          success: false,
          message: "Token expired"
        })
        return
      }
    }
    const user = await prisma.user.findUnique({
      where:{
        email:(currUser as JwtPayload).email
      }
    })
   res.status(200).json({
    success:true,
    user:user
   })
  } catch (error) {
    console.error(error)
  }
}
const checkUserName= async(req:Request, res:Response)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1]
    const {username} = req.body
    console.log("dad",token, username)
    if(!username || !token){
      res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }
    const currUser = verifyToken(token as string)
    if(currUser === null){
      res.status(404).json({
        success:false,
        message:"Unauthenticated"
      })
      return;
    }
    if (currUser && typeof currUser === 'object' && 'exp' in currUser) {
      if ((currUser.exp as number) < Date.now() / 1000) {
        res.status(400).json({
          success: false,
          message: "Token expired"
        })
        return
      }
    }
    const isUserNameExist = await prisma.user.findUnique({
      where:{
        userName:username
      }
    })
    if(isUserNameExist){
      res.status(400).json({
        success:false,
        message:"Username already exists"
      })
      return
    }

    res.status(200).json({
      success:true,
      message:"Username available"
    })
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({
        success:false,
        message:"Internal server error"
    })
  }
}

const updateProfile= async(req:Request, res:Response)=>{
  console.log("in update profile")
  try {
    const token = req.headers.authorization?.split(" ")[1]
    const {username,avatar} = req.body

    console.log("dad",token, username, avatar)
    if(!username || !token || !avatar){
      res.status(400).json({
        success:false,
        message:"All fields are required"
      })
      return
    }
    const currUser = verifyToken(token as string)
    if(currUser === null){
      res.status(404).json({
        success:false,
        message:"Unauthenticated"
      })
      return;
    }
    if (currUser && typeof currUser === 'object' && 'exp' in currUser) {
      if ((currUser.exp as number) < Date.now() / 1000) {
        res.status(400).json({
          success: false,
          message: "Token expired"
        })
        return
      }
    }

    const updateUser = await prisma.user.update({
      where:{
        email:(currUser as JwtPayload).email
      },
      data:{
        userName:username,
        avatar:avatar
      }
    })

    res.status(200).json({
      success:true,
      message:"Profile updated successfully",
      user:updateUser
    })

  } catch (error) {
    res.status(500).json({
        success:false,
        message:"Internal server error"
    })
  }
}

export { signIn , loginUser, getUser, checkUserName, updateProfile};
