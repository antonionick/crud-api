import { IncomingMessage, ServerResponse } from 'http';
import { UsersController } from '../users.controller.js';
import { GET_ALL_USERS_ENDPOINT, GET_USER_BY_ID_ENDPOINT } from './users-router.models.js';

export const usersRouterFabric =
  (userController: UsersController) =>
  async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    if (req.method === 'GET' && GET_ALL_USERS_ENDPOINT.test(req.url ?? '')) {
      await userController.handleAllUsersRequest(req, res);
      return true;
    } else if (req.method === 'GET' && GET_USER_BY_ID_ENDPOINT.test(req.url ?? '')) {
      await userController.handleUserByIdRequest(req, res);
      return true;
    }

    return false;
  };
