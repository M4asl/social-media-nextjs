import nc from 'next-connect';
import connectDb from '../../../../config/dbConnect';

import onError from '../../../../middlewares/dbErrorHandler';
import { protect } from '../../../../middlewares/auth';
import { uncomment } from '../../../../controllers/postController';

const handler = nc({ onError });

connectDb();

handler.use(protect).put(uncomment);

export default handler;
