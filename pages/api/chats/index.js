import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { protect } from '../../../middlewares/auth';
import {
  createChat,
  getChatsUser,
} from '../../../controllers/chatController';

const handler = nc({ onError });

connectDb();

handler.use(protect).post(createChat);
handler.use(protect).get(getChatsUser);

export default handler;
