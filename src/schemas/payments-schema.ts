import Joi from 'joi';

export const paymentsSchema = Joi.object({
  ticketId: Joi.required(),
});

export type GetPayment = { ticketId: string };
