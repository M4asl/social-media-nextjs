import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { logout } from '../../../controllers/authController';

const handler = nc({ onError });

connectDb();

handler.get(logout);

export default handler;
