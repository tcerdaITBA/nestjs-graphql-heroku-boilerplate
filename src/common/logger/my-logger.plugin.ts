import { Plugin } from '@nestjs/graphql';
import { randomBytes } from 'crypto';
import { MyLogger } from './my-logger.service';
import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';

@Plugin()
export class MyLoggerPlugin implements ApolloServerPlugin {
  constructor(private readonly logger: MyLogger) {
    this.logger.setContext('MyLoggerPlugin');
  }

  requestDidStart({ request }: GraphQLRequestContext): GraphQLRequestListener {
    // filter introspection queries
    if (request.operationName === 'IntrospectionQuery') {
      return {};
    }

    const logger = this.logger;
    const id = randomBytes(16).toString('hex');
    let operationResolved = false;

    return {
      didResolveOperation({ request, operation, operationName }: GraphQLRequestContext) {
        operationResolved = true;

        logger.log(
          `>>> req ${id} [op=${operation.operation}] [name=${operationName}]\n${request.query}`
        );
      },

      willSendResponse({ source, response, operation, operationName }: GraphQLRequestContext) {
        const { data, errors } = response;

        if (data) {
          const jsonData = JSON.stringify(data);
          logger.log(
            `<<< res ${id} [op=${operation.operation}] [name=${operationName}]\n${jsonData}`
          );
        }

        if (errors) {
          if (!operationResolved) {
            logger.log(`>>> req ${id} [op=undefined] [name=undefined]\n${source}`);
          }

          const jsonErrors = JSON.stringify(errors);
          logger.warn(
            `<<< err ${id} [op=${
              operation ? operation.operation : 'undefined'
            }] [name=${operationName}]\n${jsonErrors}`
          );
        }
      },
    };
  }
}
