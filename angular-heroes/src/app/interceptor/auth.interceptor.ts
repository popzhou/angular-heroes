import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch'
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

//https://github.com/angular/angular/issues/18224
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector,
        private router: Router
        // private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header.
        const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('JWToken')) });

        console.log(authReq);

        return next.handle(authReq);
    }

    refreshToken(): void {
        const authService = this.injector.get(AuthService);
        const oldToken = localStorage.getItem('JWToken');
        console.log(oldToken);
        authService.refreshToken(oldToken).subscribe((data) => {
            console.log(data);
            if (data.success) {
                // localStorage.setItem('JWToken', data.token);
            }
            else {
                // localStorage.removeItem('JWToken');
                this.router.navigateByUrl('/login');
            }
        })
    }
}