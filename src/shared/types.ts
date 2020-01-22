import { Request } from 'express';
import { User } from 'src/modules/user/user.entity';

export type RequestWithUser = Request & { user: User };
export type OrderDir = 'DESC' | 'ASC';
