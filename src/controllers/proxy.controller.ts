import {
  AnyObject
} from '@loopback/repository';
import {
  response,
  requestBody,
  post,
} from '@loopback/rest';
import axios from 'axios';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class TestController {
  constructor() {}

  @post('/test')
  @response(200, {
    description: 'Endpoint para hacer una llamada a una url determinada',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async proxy(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            "type": "object",
            "properties": {
              "call": {
                "type": "string"
              },
              "url": {
                "type": "string"
              },
              "body": {
                "type": "object"
              },
            },
          },
        },
      },
    })
    object: AnyObject,
  ): Promise<AnyObject> {
    switch (object.call) {
      case 'get':
        return axios
            .get(object.url)
            .then(response => {
              return response.data;
            })
            .catch(error => {
              return error;
            })
      case 'post':
        return axios
            .post(object.url, object.body)
            .then(response => {
              return response.data;
            })
            .catch(error => {
              return error;
            })
      default:
        return axios
            .get(object.url)
            .then(response => {
              return response.data;
            })
            .catch(error => {
              return error;
            })
    }
  }
}
