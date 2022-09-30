import {Router} from 'express';
import args from '../config/nodeArguments.js';


const router = Router();

router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('home', { user: req.session.user });
 
  });
  
  router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('register');
  });
  
  router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('login');
  });
  
  router.get('/logout', (req, res) => {
    res.render('logout');
  });

  router.get('/info',(req,res)=>{
   
    const information ={
      args:JSON.stringify(args),
      platform:process.platform,
      nodeVersion:process.version,
      rss:process.memoryUsage().rss,
      execPath:process.execPath,
      processId:process.pid,
      currentDirectory:process.cwd()
  }

    res.render('info',{information});
  })

  // router.get('/api/randoms',(req,res)=>{
  //   res.render('randoms');
  // })


  export default router;