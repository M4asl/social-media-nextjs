import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { protect } from '../../../middlewares/auth';
import { getAllUsers } from '../../../controllers/userController';

const handler = nc({ onError });

connectDb();

handler.use(protect).get(getAllUsers);

export default handler;
