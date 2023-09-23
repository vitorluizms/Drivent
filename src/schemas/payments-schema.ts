import Joi from 'joi';

export const paymentSchema = Joi.object<TicketId>({
  ticketId: Joi.number().greater(0).required(),
  cardData: Joi.object().required(),
});

export type TicketId = { ticketId: number; cardData: CardData };
export type CardData = { issuer: string; number: number; name: string; expirationDate: Date; cvv: number };
