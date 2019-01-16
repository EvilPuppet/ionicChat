import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthState } from 'angularfire2';

import { UserService } from '../../providers/user/user.service';
import { AuthService } from '../../providers/auth/auth.service';
import 'rxjs/add/operator/first';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fb: FormBuilder,
              public userService: UserService,
              public authService: AuthService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {

                let emailregex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

                this.signupForm= this.fb.group({
                  name: ['',[Validators.required, Validators.minLength(3)]],
                  username: ['',[Validators.required, Validators.minLength(3)]],
                  email: ['', Validators.compose([Validators.required, Validators.pattern(emailregex)])],
                  password: ['',[Validators.required, Validators.minLength(6)]],
                });


              }

  onSubmit(): void {
    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value
    let username: string = formUser.username;

    this.userService.userExists(username)
    .first()
    .subscribe((userExist: boolean) => {
      if (!userExist) {
        this.authService.createAuthUser({
          email: formUser.email,
          password: formUser.password
        }).then((authState: FirebaseAuthState) => {

          delete formUser.password;
          let uuid: string = authState.auth.uid;

          this.userService.create(formUser, uuid)
            .then(() => {
            console.log("Usuario cadastro");
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });

        }).catch((error: any) => {
          console.log(error);
          loading.dismiss();
          this.showAlert(error);
        })
      } else {
        this.showAlert(`O username ${username} já esta sendo usado em outra conta`);
        loading.dismiss()
      }
    });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait..'
    });

    loading.present();
    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }
}
