import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import { getCurrentUserProfile } from '../../../controllers/authController';
import { protect } from '../../../middlewares/auth';

import onError from '../../../middlewares/dbErrorHandler';

const handler = nc({ onError });

connectDb();

handler.use(protect).get(getCurrentUserProfile);

export default handler;
