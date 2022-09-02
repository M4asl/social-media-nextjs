import nc from 'next-connect';
import connectDb from '../../../../config/dbConnect';

import onError from '../../../../middlewares/dbErrorHandler';
import { protect } from '../../../../middlewares/auth';
import {
  unlikedPost,
  unlikePost,
} from '../../../../controllers/postController';

const handler = nc({ onError });

connectDb();

handler.use(protect).post(unlikePost, unlikedPost);

export default handler;
