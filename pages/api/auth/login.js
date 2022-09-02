import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { login } from '../../../controllers/authController';

const handler = nc({ onError });

connectDb();

handler.post(login);

export default handler;
