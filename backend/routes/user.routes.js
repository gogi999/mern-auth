import express from 'express';
import { register, login, getUserById } from '../controllers/user.controllers.js';
import { requireLogin } from '../middleware/auth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', requireLogin, getUserById);

export default router;
