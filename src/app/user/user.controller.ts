import { HttpException } from 'exception';
import { AuthRequest, Response } from 'model';
import { validate } from 'utils';
import userService from './user.service';
import { EditUserInput } from './user.types';
import { editUserValidator } from './user.validation';

const editUser = async (req: AuthRequest<EditUserInput>, res: Response<void>) => {
  const user = req.user;
  const editUserInput = req.body;

  try {
    validate(editUserInput, editUserValidator);
    await userService.editUser(editUserInput, user);

    res.send();
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message, authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

export default {
  editUser,
};
