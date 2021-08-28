import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Request, RequestRelations} from '../models';

export class RequestRepository extends DefaultCrudRepository<
  Request,
  typeof Request.prototype.id,
  RequestRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Request, dataSource);
  }

  filterRequests(userId: string, request: string, url: string): Filter<Request> {
    var actualDate = new Date();
    const FIVE_MINUTES = 60 * 5 * 1000;
    var firstDate = new Date(actualDate.getTime() - FIVE_MINUTES)
    return {
      fields: {
        id:true,
      },
      where: {
        userId:userId,
        request:request,
        url:url,
        date:{gt: firstDate},
      }
    }
  }
}
