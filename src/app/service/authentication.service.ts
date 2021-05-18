import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public host = environment.apiUrl;
  private token: string;
  private loggedInUserName: string;
  private jwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient ) { 
    
  }

 login(user: User): Observable<HttpResponse<User>> {
  return this.http.post<User> (`${this.host}/user/login`, user, {observe: 'response'} );
}

register(user: User): Observable<User> {
  return this.http.post<User >
  (`${this.host}/user/register`, user );
}

logOut(): void{
  this.token = null;
  this.loggedInUserName = null;
  localStorage.removeItem('user');// Item değişkenlerinin isimleri güvenlik için değiştirilmeli
  localStorage.removeItem('token'); // Item değişkenlerinin isimleri güvenlik için değiştirilmeli
  localStorage.removeItem('users'); // Item değişkenlerinin isimleri güvenlik için değiştirilmeli

}

saveToken(token: string): void{
  this.token = token;
  localStorage.setItem('token', token); // Item değişkenlerinin isimleri güvenlik için değiştirilmeli

}

addUserToLocalCache(user: User): void{
  localStorage.setItem('user', JSON.stringify(user)); // Item değişkenlerinin isimleri güvenlik için değiştirilmeli

}

getUserFromLocalCache(): User{
 return JSON.parse(localStorage.getItem('user')) ; // Item değişkenlerinin isimleri güvenlik için değiştirilmeli
}


loadToken(): void{
   this.token = localStorage.getItem('token'); // Item değişkenlerinin isimleri güvenlik için değiştirilmeli
 }

 getTokenFromLocalCache(): string{
  return this.token; // Item değişkenlerinin isimleri güvenlik için değiştirilmeli
 }

  isLoggedIn(): boolean {
   this.loadToken();
   if (this.token != null && this.token !== '') {
      if (this.jwtHelperService.decodeToken(this.token).sub != null ||  ''){
        if (!this.jwtHelperService.isTokenExpired(this.token)){
          this.loggedInUserName = this.jwtHelperService.decodeToken(this.token).sub;
          return true;
        }
      }
   } else {
     this.logOut();
     return false;
   }
   
 }





}
