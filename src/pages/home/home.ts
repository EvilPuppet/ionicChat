import { Component } from '@angular/core';
import firebase from 'firebase';
import { NavController, MenuController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { FirebaseListObservable } from 'angularfire2';
import { User } from '../../model/user.model';
import { UserService } from '../../providers/user/user.service';
import { AuthService } from '../../providers/auth/auth.service';
import { ChatPage } from '../chat/chat';
import { ChatService } from '../../providers/chat/chat.service';
import { Chat } from '../../model/chat.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  view: string = 'chats';
  users: FirebaseListObservable<User[]>;
  chats: FirebaseListObservable<Chat[]>;
  constructor(public navCtrl: NavController,
              public userService: UserService,
              public authService: AuthService,
              public chatService: ChatService,
              public menuCtrl: MenuController) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.chats = this.chatService.chats;
    this.users = this.userService.users;
    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any):void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    if (searchTerm) {
      switch(this.view) {
        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>> this.chats.map((chats: Chat[]) => {
            return chats.filter((chat: Chat) => {
              return (chat.title.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >-1);
            });
          });
          break;
        case 'users':
        this.users = <FirebaseListObservable<User[]>> this.users
          .map((users: User[]) => {
            return users.filter((user: User) => {
              return (user.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >-1);
            });
          });
          break;
      }
    }
  }


  onSignup(): void {
    this.navCtrl.push(SignupPage);
   }

   onChatCreate(recipientUser: User):void {
    this.userService.currentUser.first().subscribe((currentUser: User) => {
      this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)
      .first()
      .subscribe((chat: Chat) => {
        if (chat.hasOwnProperty('$value')) {
          let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

          let chat1 = new Chat('', timestamp, recipientUser.name, '')
          this.chatService.create(chat1, currentUser.$key, recipientUser.$key);

          let chat2 = new Chat('', timestamp, currentUser.name, '')
          this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
        }
      });
    });

    this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser
    });
   }

   onChatOpen(chat: Chat): void {
     let recipientUserId: string = chat.$key;
     this.userService.get(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });
      });
   }

}
