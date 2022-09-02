import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { protect } from '../../../middlewares/auth';
import { hasAuthorization } from '../../../controllers/authController';
import {
  getUser,
  removeUser,
  updateUser,
} from '../../../controllers/userController';

const handler = nc({ onError });

connectDb();

handler.use(protect).get(getUser);
handler.use(protect).put(updateUser);
handler.use(protect).use(hasAuthorization).delete(removeUser);

export default handler;
