import { Injectable } from '@angular/core';
import { SignoutResponse, User, UserManager } from 'oidc-client';
import { Subject } from 'rxjs';
import { UserAccessService } from 'src/app/data/api-access/user-access.service';
import { UserModel } from 'src/app/common/models/user.model';
import { environment } from '../../../environments/environment'

@Injectable()
export class AuthorizationService {
  private _userManager: UserManager;
  private _user: User = null;
  private _loginChangedSubject = new Subject<boolean>();
  public loginChanged = this._loginChangedSubject.asObservable();

  public currentUser: UserModel;
  private _isLoadingCurrentUser: boolean = false;

  public currentUserId: string;
  private _userLoadedSubject = new Subject<boolean>();
  public userLoaded = this._userLoadedSubject.asObservable();

  constructor(private _dataService: UserAccessService) {
    this._userManager = new UserManager(this.getStsSettings());

    this._userManager.events.addAccessTokenExpired(_ => {
      this._loginChangedSubject.next(false);
    })

    this._userManager.events.addUserLoaded(user => {
      if (this._user !== user) {
        this._user = user;
        this.currentUserId = this._user.profile.sub;
        this.loadSecurityContext();
        this._loginChangedSubject.next(!!user && !user.expired);
      }
    })
  }
  login(): Promise<void> {
    return this._userManager.signinRedirect();
  }
  isLoggedIn(): Promise<boolean> {
    return this._userManager.getUser().then(user => {
      const userCurrent = !!user && !user.expired;
      this._user = user;
      if (this._user !== user) {
        this._loginChangedSubject.next(userCurrent);
      }
      if (userCurrent && !this.currentUser && !this._isLoadingCurrentUser) {
        this.currentUserId = this._user.profile.sub;
        this.loadSecurityContext();
      }
      return userCurrent;
    })
  }
  completeLogin(): Promise<User> {
    return this._userManager.signinRedirectCallback().then(user => {
      this._user = user;
      this._loginChangedSubject.next(!!user && !user.expired);
      return user;
    })
  }
  logout(): void {
    this._user = null;
    this._loginChangedSubject.next(false);
    this._userManager.signoutRedirect();
  }
  completeLogout(): Promise<SignoutResponse> {
    return this._userManager.signoutRedirectCallback();
  }
  getAccessToken(): Promise<string> {
    return this._userManager.getUser().then(user => {
      if (!!user && !user.expired) {
        return user.access_token;
      }
      else {
        return null;
      }
    });
  }
  loadSecurityContext() : void {
    this._isLoadingCurrentUser = true;
    this._dataService.getUser(this._user?.profile.sub)
      .subscribe(
        result => {
          this.currentUser = new UserModel(result);
          this._isLoadingCurrentUser = false;
          this._userLoadedSubject.next(true);
        },
      );
  }

  private getStsSettings() : Object {
    return {
      authority: environment.stsAuthority,
      client_id: environment.clientId,
      redirect_uri: `${environment.clientRoot}signin-callback`,
      scope: environment.scope,
      response_type: environment.response_type,
      post_logout_redirect_uri: `${environment.clientRoot}signout-callback`
    }
  }
}
