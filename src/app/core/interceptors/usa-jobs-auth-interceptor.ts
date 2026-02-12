import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const usaJobsAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.usaJobsApi.url;

  if (!req.url.startsWith(apiUrl)) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      'Authorization-Key': environment.usaJobsApi.apiKey,
      'User-Agent': environment.usaJobsApi.userAgent
    }
  });

  return next(authReq);
};
