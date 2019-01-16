import { Component, Input } from '@angular/core';
import { BaseComponnet } from '../base.component';
import { MenuController, App, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'custom-logged-header',
  templateUrl: 'custom-logged-header.component.html'
})
export class CustomLoggedHeaderComponent extends BaseComponnet {

  @Input() title: string;
  @Input() user: User;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertCtrl, authService, app, menuCtrl);
  }

}
