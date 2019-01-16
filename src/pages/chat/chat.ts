import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from '../../model/user.model';
import { UserService } from '../../providers/user/user.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Message } from '../../model/message.model';
import { MessageService } from '../../providers/message/message.service';

import firebase from 'firebase';
import { Chat } from '../../model/chat.model';
import { ChatService } from '../../providers/chat/chat.service';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;

  messages: FirebaseListObservable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  map: any;

  private chat1: FirebaseObjectObservable<Chat>;
  private chat2: FirebaseObjectObservable<Chat>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public userService: UserService,
              public messageService: MessageService,
              public chatService: ChatService,
              public geolocation: Geolocation
              ) {
            }


  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {

      // ----------------------------------------------------------------------

    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;

    this.userService.currentUser.first().subscribe((currentUser: User) => {
      this.sender = currentUser;

      this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);
      this.chat2 = this.chatService.getDeepChat(this.recipient.$key, this.sender.$key);

      this.chat1
      .first()
      .subscribe((chat: Chat) => {
        this.chatService.updatePhoto(this.chat1, chat.photo, this.recipient.photo)
      })

      let doSubscription = () => {
        this.messages.subscribe((messages: Message[]) => {
          this.scrollToBottom();
        })
      }

      this.messages = this.messageService.getMessages(this.sender.$key, this.recipient.$key);
      this.messages.first().subscribe((messages: Message[]) => {
        if (messages.length === 0) {
          this.messages = this.messageService
            .getMessages(this.recipient.$key, this.sender.$key);

            doSubscription();
        } else {
          doSubscription();
        }
      });
    });
  }

  sendMessage(newMessage: string): void {
    if (newMessage) {
      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP
      this.messageService.create(
        new Message(
          this.sender.$key,
          newMessage,
          currentTimestamp
          ),
          this.messages
      ).then(() => {
        this.chat1.update({
          lastMessage: newMessage,
          timestamp:currentTimestamp
        });
        this.chat2.update({
          lastMessage: newMessage,
          timestamp:currentTimestamp
      });
    });
    }
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if(this.content) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);
  }

   showMaps(): void {
     this.geolocation.getCurrentPosition()
     .then((resp) => {
       const position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

       const mapOptions = {
         zoom: 18,
         center: position
       }

       this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

       const marker = new google.maps.Marker({
         position: position,
         map: this.map
       });

     }).catch((error) => {
       console.log('Erro ao recuperar sua posição', error);
     });
   }
}
