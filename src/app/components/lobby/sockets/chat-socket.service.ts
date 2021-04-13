import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message';
import { environment } from '../../../../environments/environment';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  private socket;
  
  connect(){
    this.socket = io.connect(`${environment.api}:${environment.chatSocketPort}`);
  }

  connected(): Observable<void> {
    return new Observable<void>(obs => {
      this.socket.on('connect', () => {
        obs.next()
      });
    })
  }

  joinRoom(roomId: string){
    this.socket.emit('joinRoom', roomId)
  }

  joinedRoom(): Observable<string> {
    return new Observable<string>(obs => {
      this.socket.on('joinedRoom', (msg :string) => {
        obs.next(msg)
      });
    })
  }

  leaveRoom(roomId: string){
    this.socket.emit('leaveRoom', roomId)
  }

  leftRoom(): Observable<string>{
    return new Observable<string>(obs => {
      this.socket.on('leftRoom', (msg: string) => {
        obs.next(msg)
      });
    })
  }

  recieveMessage(): Observable<Message>{
    return new Observable<Message>(obs => {
      this.socket.on('recieveMessage', (msg: Message) => {
        obs.next(msg)
      });
    })
  }

  sendMessage(message: Message){
    this.socket.emit("chatToRoom", message);
  }
}