import { hotelsController } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter.use(authenticateToken);
hotelsRouter.get('/', hotelsController.getHotels);
hotelsRouter.get('/:hotelId', hotelsController.getHotelById);

export default hotelsRouter;
