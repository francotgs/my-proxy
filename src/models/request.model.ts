import {Entity, model, property} from '@loopback/repository';

@model()
export class Request extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    default: 'get',
  })
  request: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'object',
  })
  body?: object;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  date: Date;


  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
