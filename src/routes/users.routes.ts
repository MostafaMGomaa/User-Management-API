import { Router } from 'express';
import { UserController } from '../controllers';
import { authenticate, isAdmin } from '../utils/middlewares/auth';
import { UserService } from '../services';
import { UserRepository } from '../repositories';
import { inputValidate } from '../utils/middlewares/validation';
import { UpdateUserDto } from '../entities/dtos';

const router = Router();
const userService = new UserService(new UserRepository());
const userController = new UserController(userService);

router.use(authenticate);

router.get('/', isAdmin, userController.getAllUsers);
router.get('/top', isAdmin, userController.getTopUsers);
router.get('/inactive', isAdmin, userController.getInactiveUsers);
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(inputValidate(UpdateUserDto), userController.updateUser)
  .delete(userController.deleteUser);

export default router;
