import {Router } from "express";
import {fork} from "child_process";



const router = Router();


router.get('/',(req,res)=>{
    const cant=req.query.number??100000000;
    const result = fork('./src/childProcess.js');
    result.send(cant);
    result.on('message',(message)=>{

        res.render('randoms',{payload:message});
    })
})







export default router;






