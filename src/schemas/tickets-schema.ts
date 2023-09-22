import { createTicket } from '@/services/tickets-service';
import Joi from 'joi';

export const ticketSchema = Joi.object<createTicket>({
  ticketTypeId: Joi.number().greater(0).required(),
});
