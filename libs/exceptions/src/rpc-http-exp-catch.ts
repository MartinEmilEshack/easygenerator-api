import { catchError, Observable, throwError } from 'rxjs';
import { HttpExceptionShape } from '../types/http-exp-shape';
import { RpcExceptionShape } from '../types/rpc-exp-shape';
import { RpcHttpClientException } from './rpc-http-client-exp';

export const rpcHttpCatch = <T>(source: Observable<T>) => {
  return source.pipe(
    catchError((error: RpcExceptionShape) => {
      let httpDetails: HttpExceptionShape | undefined = undefined;

      try {
        httpDetails = JSON.parse(error.details) as HttpExceptionShape;
      } catch (parseError) {
        return throwError(() => error);
      }

      if (httpDetails)
        throw new RpcHttpClientException(
          httpDetails.name,
          httpDetails.message,
          httpDetails.status,
        );
      else return throwError(() => error);
    }),
  );
};
