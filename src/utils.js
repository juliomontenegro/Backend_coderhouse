import{fileURLToPath} from 'url';
import bcrypt from 'bcrypt';


import{dirname} from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const compareHash = (existUser,password) => bcrypt.compareSync(password,existUser.password);

export default __dirname
