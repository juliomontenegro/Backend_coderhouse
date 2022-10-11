import {Router} from 'express';
import {debugLogger } from '../utils.js';



const router = Router();



router.get("/", (req, res) => {
    const response = api.getAll();
    debugLogger.info(`get all products: ${api.productos.length}`);
    if (!response) res.send({ error: productNotFound });
    res.render("productos", { productos: response });
   
  }); 
  
  router.post("/", (req, res) => {
    const { title, price, thumbnail } = req.body;
    
    debugLogger.info(`adding product`);
    api.add({ title, price, thumbnail })
    debugLogger.info(`product added`);
    res.redirect("/");
  });

  export default router;