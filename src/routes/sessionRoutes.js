import{Router}from'express';
import passport from 'passport';




const router=Router();


router.post('/register', passport.authenticate('register',{failureRedirect:'/api/sessions/registerfail'}), async (req, res) => {
    console.log(req.user);
    res.send({ status: 'success', payload: req.user._id })
});
router.get('/registerfail', async (req, res) => {
    console.log('Register failed');
    res.status(500).send({ status: 'error', error: 'Register failed' });
});

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginfail'}),async(req,res)=>{
    req.session.user ={
        name:req.user.name,
        email:req.user.email,
        id:req.user._id
    }
    res.send({status:"success",payload:req.user._id})
})
router.get('/loginfail',(req,res)=>{
    console.log("login failed");
    res.send({status:"error",error:"Login failed"})
})




export default router;
