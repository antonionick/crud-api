import { IncomingMessage, ServerResponse } from 'http';
import { UsersController } from '../users.controller.js';
import { API_USERS_REGEX, API_USERS_ID_REGEX } from './users-router.models.js';

export const usersRouterFabric =
  (userController: UsersController) =>
  async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    if (req.method === 'GET' && API_USERS_REGEX.test(req.url ?? '')) {
      await userController.getAllUsers(req, res);
      return true;
    } else if (req.method === 'GET' && API_USERS_ID_REGEX.test(req.url ?? '')) {
      await userController.getUserById(req, res);
      return true;
    } else if (req.method === 'POST' && API_USERS_REGEX.test(req.url ?? '')) {
      await userController.createUser(req, res);
      return true;
    } else if (req.method === 'PUT' && API_USERS_ID_REGEX.test(req.url ?? '')) {
      await userController.updateUser(req, res);
      return true;
    } else if (req.method === 'DELETE' && API_USERS_ID_REGEX.test(req.url ?? '')) {
      await userController.deleteUser(req, res);
      return true;
    }

    return false;
  };
