import nc from 'next-connect';
import connectDb from '../../../../config/dbConnect';

import onError from '../../../../middlewares/dbErrorHandler';
import { protect } from '../../../../middlewares/auth';
import {
  addFollower,
  addFollowing,
} from '../../../../controllers/userController';

const handler = nc({ onError });

connectDb();

handler.use(protect).put(addFollowing, addFollower);

export default handler;
