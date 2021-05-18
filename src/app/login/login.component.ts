import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from '../enum/header-type.enum';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotficationService } from '../service/notfication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  showLoading: boolean;
  private subscriptions: Subscription[] = [];


  constructor(private router:Router, private authenticationService: AuthenticationService,
              private notificationService: NotficationService ) { }

  ngOnInit(): void {
    if(this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  onLogin(user: User): void {
    this.showLoading = true;
    
    this.subscriptions.push(this.authenticationService.login(user).subscribe(
      (response: HttpResponse<User>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN);
        this.authenticationService.saveToken(token);
        this.authenticationService.addUserToLocalCache(response.body);
        this.router.navigateByUrl('/user/management');
        this.showLoading = false;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        
        this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message)
      }
    ));
  }
  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if(message) {
      this.notificationService.notify(notificationType,message);
    } else 
    {
      this.notificationService.notify(notificationType,'AN ERROR OCCURED PLEASE TRY IT AGAIN.');
       this.router.navigateByUrl('/login');
    }
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
