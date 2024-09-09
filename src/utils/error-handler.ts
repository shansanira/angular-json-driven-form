import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export function handleError(err: HttpErrorResponse, router?: Router): string {
  let errorMessage = '';
  if (err.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    const errorCode = err.status ? 'Server returned code: ${err.status}' : '';
    errorMessage = `${errorCode ?? errorCode + ','} ${err.message}`;

    if (err.status === 404) {
      // Navigate to the not-found page if the status code is 404.
      router?.navigate(['/not-found']);
    }
  }
  return errorMessage;
}
