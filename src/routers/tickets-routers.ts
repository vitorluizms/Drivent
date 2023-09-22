import { ticketsController } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema } from '@/schemas/tickets-schema';
import { CreateTicket } from '@/services/tickets-service';
import { Router } from 'express';

const ticketRouter = Router();

ticketRouter.use(authenticateToken);
ticketRouter.get('/types', ticketsController.getTypes);
ticketRouter.get('/', ticketsController.getTicketsByUser);
ticketRouter.post('/', validateBody<CreateTicket>(ticketSchema), ticketsController.postTicketByUser);

export { ticketRouter };
