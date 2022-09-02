import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { getMessagesByChatId } from '../../../controllers/messageController';
import { protect } from '../../../middlewares/auth';

const handler = nc({ onError });

connectDb();

handler.use(protect).get(getMessagesByChatId);

export default handler;
