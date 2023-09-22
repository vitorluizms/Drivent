import { CreateTicket } from '@/services/tickets-service';
import Joi from 'joi';

export const ticketSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().greater(0).required(),
});
