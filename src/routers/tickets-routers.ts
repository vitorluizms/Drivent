import { ticketsController } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const ticketRouter = Router();

ticketRouter.use(authenticateToken);
ticketRouter.get('/types', ticketsController.getTypes);
ticketRouter.get('/', ticketsController.getTicketsByUser);

export { ticketRouter };
