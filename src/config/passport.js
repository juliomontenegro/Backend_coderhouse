import passport from 'passport';
import local from 'passport-local';
import { createHash, compareHash } from '../utils.js';
import userModel from '../models/userModel.js';

const LocalStrategy = local.Strategy;

const initializePassport=()=>{
    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:'email'},async(req,email,password,done)=>{
       try{
        const{name,email,password}=req.body;	
        if(!name || !email || !password) return done(null,false);
          let existUser = await userModel.findOne({email:email });
             if(existUser) return done(null,false);
             let newUser= await userModel.create({name:name,email:email,password:createHash(password)});
             return done(null,newUser);
       }catch (error){
           return done(error);
       }
    }));

    passport.use('login', new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
        try{
            if(!email || !password) return done(null,false);
            let existUser = await userModel.findOne({email:email });
            if(!existUser) return done(null,false);
            if(!compareHash(existUser,password)) return done(null,false);
            return done(null,existUser);
        }catch (error){
            return done(error);
        }
    }));





    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });
    passport.deserializeUser(async(id,done)=>{
        const userFound=await userModel.findOne({_id:id});
        done(null,userFound);
    });
}

export default initializePassport;