import nc from 'next-connect';
import connectDb from '../../../../config/dbConnect';

import onError from '../../../../middlewares/dbErrorHandler';
import { listNewsFeed } from '../../../../controllers/postController';
import { protect } from '../../../../middlewares/auth';

const handler = nc({ onError });

connectDb();

handler.use(protect).get(listNewsFeed);

export default handler;
