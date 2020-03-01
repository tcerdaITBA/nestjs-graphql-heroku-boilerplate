import { randomBytes } from 'crypto';
import { MyLogger } from './my-logger.service';
import { GraphQLRequestContext } from 'apollo-server-types';

export class MyLoggerPlugin {
  private readonly logger: MyLogger;

  constructor() {
    this.logger = new MyLogger();
    this.logger.setContext('MyLoggerPlugin');
  }

  requestDidStart({ request }: GraphQLRequestContext) {
    // filter introspection queries
    if (request.operationName === 'IntrospectionQuery') {
      return {};
    }

    const logger = this.logger;
    const id = randomBytes(16).toString('hex');

    return {
      didResolveOperation({ request, operation, operationName }: GraphQLRequestContext) {
        logger.log(
          `>>> req ${id} [op=${operation.operation}] [name=${operationName}]\n${request.query}`
        );
      },

      willSendResponse({ response, operation, operationName }: GraphQLRequestContext) {
        const { data, errors } = response;

        if (data) {
          const jsonData = JSON.stringify(data);
          logger.log(
            `<<< res ${id} [op=${operation.operation}] [name=${operationName}]\n${jsonData}`
          );
        }

        if (errors) {
          const jsonErrors = JSON.stringify(errors);
          logger.warn(
            `<<< err ${id} [op=${operation.operation}] [name=${operationName}]\n${jsonErrors}`
          );
        }
      }
    };
  }
}
