import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotficationService } from '../service/notfication.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  showLoading: boolean;
  private subscriptions: Subscription[] = [];


  constructor(private router:Router, private authenticationService: AuthenticationService,
              private notificationService: NotficationService ) { }

  ngOnInit(): void {
    if(this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }

  onRegister(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(this.authenticationService.register(user).subscribe(
      (response: User) => {
        this.showLoading = false;
        this.sendErrorNotification(NotificationType.SUCCESS, `A new account was created for ${response.username}. Please check your email for login password.`)
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
       this.router.navigateByUrl('/register');
    }
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
