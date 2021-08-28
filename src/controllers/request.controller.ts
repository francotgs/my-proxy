import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import axios from 'axios';
import {Request} from '../models';
import {RequestRepository} from '../repositories';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class RequestController {
  constructor(
    @repository(RequestRepository)
    public requestRepository : RequestRepository,
  ) {}

  @post('/proxy')
  @response(200, {
    description: 'Request a una url determinada',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequest',
            exclude: ['id', 'date', 'userId'],
          }),
        },
      },
    })
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    request: Omit<Request, 'id'>,
  ): Promise<any> {
    request.userId = currentUserProfile[securityId];
    let requests = await this.requestRepository.find(this.requestRepository.filterRequests(request.userId, request.request, request.url));
    let length = requests.length;
    if (length < 5){
      switch (request.request) {
        case 'get':
          return axios
              .get(request.url)
              .then(response => {
                this.requestRepository.create(request);
                return response.data;
              })
              .catch(error => {
                return error;
              })
        case 'post':
          return axios
              .post(request.url, request.body)
              .then(response => {
                this.requestRepository.create(request);
                return response.data;
              })
              .catch(error => {
                return error;
              })
        default:
          return axios
              .get(request.url)
              .then(response => {
                this.requestRepository.create(request);
                return response.data;
              })
              .catch(error => {
                return error;
              })
      }
    } else {
        return null;
    }
  }

  @get('/requests/count')
  @response(200, {
    description: 'Request model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Request) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestRepository.count(where);
  }

  @get('/requests')
  @response(200, {
    description: 'Array of Request model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Request, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Request) filter?: Filter<Request>,
  ): Promise<Request[]> {
    return this.requestRepository.find(filter);
  }

  @patch('/requests')
  @response(200, {
    description: 'Request PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
    @param.where(Request) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestRepository.updateAll(request, where);
  }

  @get('/requests/{id}')
  @response(200, {
    description: 'Request model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Request, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Request, {exclude: 'where'}) filter?: FilterExcludingWhere<Request>
  ): Promise<Request> {
    return this.requestRepository.findById(id, filter);
  }

  @patch('/requests/{id}')
  @response(204, {
    description: 'Request PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
  ): Promise<void> {
    await this.requestRepository.updateById(id, request);
  }

  @put('/requests/{id}')
  @response(204, {
    description: 'Request PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() request: Request,
  ): Promise<void> {
    await this.requestRepository.replaceById(id, request);
  }

  @del('/requests/{id}')
  @response(204, {
    description: 'Request DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requestRepository.deleteById(id);
  }
}
