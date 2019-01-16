import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Chat } from '../../model/chat.model';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { auth } from 'firebase';

@Injectable()
export class ChatService extends BaseService{

  chats: FirebaseListObservable<Chat[]>;

  constructor(public http: Http,
              public af: AngularFire) {
    super();
    this.setChats();
  }

  private setChats(): void {
    this.af.auth.subscribe((authState: FirebaseAuthState) => {
      if (authState) {
        this.chats = <FirebaseListObservable<Chat[]>> this.af.database.list(`/chats/${authState.auth.uid}`, {
          query: {
            orderByChild: 'timestamp'
          }
        }).map((chats: Chat[])=> {
          return chats.reverse();
        }).catch(this.handleObservableError);
      }
    })
  }

  create(chat: Chat, userId1: string, userid2: string): firebase.Promise<void> {
    return this.af.database.object(`/chats/${userId1}/${userid2}`)
    .set(chat)
    .catch(this.handlePromisseError)
  }

  getDeepChat(userId1: string, userid2: string): FirebaseObjectObservable<Chat> {
    return <FirebaseObjectObservable<Chat>> this.af.database.object(`/chats/${userId1}/${userid2}`)
    .catch(this.handleObservableError);
  }

  updatePhoto(chat: FirebaseObjectObservable<Chat>, chatPhoto: string, recipientUserPhoto: string): firebase.Promise<void> {
    if (chatPhoto != recipientUserPhoto) {
      return chat.update({
        photo: recipientUserPhoto
      });
    }
    return Promise.resolve();
  }
}
