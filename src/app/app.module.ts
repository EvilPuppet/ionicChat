import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule } from '@angular/http'
import { AngularFireModule, FirebaseAppConfig, FirebaseAuthConfig, AuthProviders, AuthMethods} from 'angularfire2';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { UserService } from '../providers/user/user.service';
import { AuthService } from '../providers/auth/auth.service';
import { SigninPage } from '../pages/signin/signin';
import { CustomLoggedHeaderComponent } from '../components/custom-logged-header/custom-logged-header.component';
import { ChatPage } from '../pages/chat/chat';
import { ChatService } from '../providers/chat/chat.service';
import { MessageService } from '../providers/message/message.service';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { UserMenuComponent } from '../components/user-menu/user-menu.component';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar.component';
import { Geolocation } from '@ionic-native/geolocation';


  const firebaseAppConfig: FirebaseAppConfig = {
    apiKey: "AIzaSyDL1lGbgZDPolkuwAWvCEJYGGEa8K_nZ48",
    authDomain: "ionicchat-1c31a.firebaseapp.com",
    databaseURL: "https://ionicchat-1c31a.firebaseio.com",
    storageBucket: "ionicchat-1c31a.appspot.com",
  };

  const fireBaseAuthConfig = {
    provider: AuthProviders.Custom,
    method: AuthMethods.Password
  }
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    CustomLoggedHeaderComponent,
    ChatPage,
    MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig, fireBaseAuthConfig),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    ChatPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    UserService,
    AuthService,
    ChatService,
    MessageService,
  ]
})
export class AppModule {}
