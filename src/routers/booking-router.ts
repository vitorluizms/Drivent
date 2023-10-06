import { bookingController } from '@/controllers/booking-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/booking-schema';
import { Router } from 'express';

const bookingRouter = Router();

bookingRouter.use(authenticateToken);
bookingRouter.get('/', bookingController.getBookingByUser);
bookingRouter.post('/', validateBody(bookingSchema), bookingController.createBooking);
bookingRouter.put('/:bookingId', validateBody(bookingSchema), bookingController.updateRoomId);
