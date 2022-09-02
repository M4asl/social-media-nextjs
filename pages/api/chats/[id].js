import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { protect } from '../../../middlewares/auth';
import { getChatById } from '../../../controllers/chatController';

const handler = nc({ onError });

connectDb();

handler.use(protect).get(getChatById);

export default handler;
