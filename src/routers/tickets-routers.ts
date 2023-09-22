import { ticketsController } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema } from '@/schemas/tickets-schema';
import { Router } from 'express';

const ticketRouter = Router();

ticketRouter.use(authenticateToken);
ticketRouter.get('/types', ticketsController.getTypes);
ticketRouter.get('/', ticketsController.getTicketsByUser);
ticketRouter.post('/', validateBody(ticketSchema), ticketsController.postTicketByUser);

export { ticketRouter };
