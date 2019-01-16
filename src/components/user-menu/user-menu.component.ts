import { Component, Input } from '@angular/core';
import { BaseComponnet } from '../base.component';
import { AlertController, App, MenuController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from '../../model/user.model';
import { UserProfilePage } from '../../pages/user-profile/user-profile';


@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.component.html'
})
export class UserMenuComponent extends BaseComponnet {

  @Input('user') currentUser: User;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertCtrl, authService, app , menuCtrl );
  }

  onProfile(): void {
    this.navCtrl.push(UserProfilePage);
  }

}
