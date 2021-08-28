import {
  AnyObject
} from '@loopback/repository';
import {
  post,
  requestBody,
  response,
} from '@loopback/rest';

export class ArrayController {
  constructor() {}

  @post('/array')
  @response(200, {
    description: 'Endpoint to check if a given array has 2 elements whose sum is equal to a given value',
    content: {
      'application/json': {
        schema: {
          type: 'boolean',
        },
      },
    },
  })
  async checksum(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            "type": "object",
            "properties": {
              "array": {
                "type": "array",
                "items": {
                  "type": "number",
                },
              },
              "sum": {
                "type": "number"
              },
            },
          },
        },
      },
    })
    object: AnyObject,
  ): Promise<boolean> {
    let array = object.array
    let sum = object.sum
    let l, r;
    let array_size=array.length;

    /* Ordeno los elementos */
    array.sort();

    /* Ahora busco si hay candidatos*/
    l = 0;
    r = array_size - 1;
    while (l < r) {
        if (array[l] + array[r] == sum)
            return true;
        else if (array[l] + array[r] < sum)
            l++;
        else // array[i] + array[j] > sum
            r--;
    }
    return false;
  }
}
