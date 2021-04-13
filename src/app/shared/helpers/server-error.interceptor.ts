import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { SnackbarService } from '../snackbar/snackbar.service';
import { Observable } from 'rxjs-compat';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private _injector: Injector,
        private snackbarService: SnackbarService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .do(event => { },
                exception => {
                    if (exception instanceof HttpErrorResponse && exception.status === 500) {
                        this.snackbarService.openError(exception.error.message || 'Unknown Server Error')
                    }
                }
            );
    }
}