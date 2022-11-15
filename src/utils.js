import{fileURLToPath} from 'url';
import bcrypt from 'bcrypt';
import{dirname} from 'path';
import multer from 'multer';
import winston from 'winston';
import FirebaseStorage from 'multer-firebase-storage';
import dotenv from 'dotenv';
dotenv.config();


const __dirname = dirname(fileURLToPath(import.meta.url));

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const compareHash = (existUser,password) => bcrypt.compareSync(password,existUser.password);


export const upload = multer({
  storage: FirebaseStorage({
    bucketName: process.env.STORAGE_BUCKET_FIREBASE,
    credentials: {
      clientEmail: process.env.CLIENT_EMAIL_FIREBASE,
      privateKey: process.env.PRIVATE_KEY_FIREBASE.replace(/\\n/g, '\n'),
      projectId: process.env.PROJECT_ID_FIREBASE,
    },
    public: true,
    unique: true,
  }),
});



//logger 

const ignoreError = winston.format((info) => {
  if (info.level==='error') return false
  return info;
});


export const debugLogger = winston.createLogger({
transports: [
  new winston.transports.Console({level:"info"}),

  new winston.transports.File({
    level: "error",
    filename: __dirname + "/logs/error.log",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.prettyPrint(),
    
    ),
  }),
  new winston.transports.File({
   
    level: "warn",
    filename: __dirname + "/logs/warn.log",
    format: winston.format.combine(
      ignoreError(),
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.prettyPrint(),
      
      
    ),
  }),
],
});

export const logger =()=>(req,res,next)=>{
req.logger=debugLogger;
  next();
}



export default __dirname