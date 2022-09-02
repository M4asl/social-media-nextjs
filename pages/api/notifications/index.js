import nc from 'next-connect';
import connectDb from '../../../config/dbConnect';

import onError from '../../../middlewares/dbErrorHandler';
import { getNotificationByUser } from '../../../controllers/notificationController';
import { protect } from '../../../middlewares/auth';

const handler = nc({ onError });

connectDb();

handler.use(protect).get(getNotificationByUser);

export default handler;
