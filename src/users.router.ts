import { IncomingMessage, ServerResponse } from 'http';
import { UsersController } from './users.controller.js';

const GET_ALL_USERS_REGEX = /api\/users/i;

export const usersRouterFabric =
  (userController: UsersController) =>
  async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    if (req.method?.toUpperCase() === 'GET' && GET_ALL_USERS_REGEX.test(req.url ?? '')) {
      await userController.handleAllUsersRequest(req, res);
      return true;
    }

    return false;
  };
