import { Router } from 'express';
import { AuthController } from '../controllers';
import { inputValidate } from '../utils/middlewares/validation';
import { CreateUserDto, LoginUserDto, VerifyUserDto } from '../entities/dtos';
import { AuthService } from '../services';
import { UserRepository } from '../repositories';

const router = Router();
const authService = new AuthService(new UserRepository());
const authController = new AuthController(authService);

router.post('/register', inputValidate(CreateUserDto), authController.register);
router.post('/login', inputValidate(LoginUserDto), authController.login);
router.post('/verify', inputValidate(VerifyUserDto), authController.verifyUser);

export default router;
