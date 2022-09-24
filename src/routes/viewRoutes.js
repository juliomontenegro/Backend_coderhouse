import {Router} from 'express';

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


  export default router;