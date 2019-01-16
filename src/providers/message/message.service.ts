import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { Message } from '../../model/message.model';
import { BaseService } from '../base.service';

@Injectable()
export class MessageService extends BaseService {

  constructor(public http: Http,
              public af: AngularFire) {
                super();
              }

  create(message: Message, listMessages: FirebaseListObservable<Message[]>): firebase.Promise<void> {
    return listMessages.push(message)
    .catch(this.handlePromisseError);
  }

  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {
    return  <FirebaseListObservable<Message[]>> this.af.database.list(`/messages/${userId1}- ${userId2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 30,
      }
    }).catch(this.handleObservableError)
  }
}
