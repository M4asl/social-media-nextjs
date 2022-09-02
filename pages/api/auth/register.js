import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { register } from '../../../controllers/authController';

const handler = nc({ onError });

connectDb();

handler.post(register);

export default handler;
