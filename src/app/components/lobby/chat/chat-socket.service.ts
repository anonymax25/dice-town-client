import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatSocket } from 'src/app/app.module';
import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  constructor(private chatSocket: ChatSocket) { }

  connect() {
    return this.chatSocket.fromEvent('connect')
  }

  joinRoom(roomId: string){
    this.chatSocket.emit('joinRoom', roomId)
  }

  joinedRoom(): Observable<string> {
    return this.chatSocket.fromEvent('joinedRoom')
  }

  leaveRoom(roomId: string){
    this.chatSocket.emit('leaveRoom', roomId)
  }

  leftRoom(): Observable<string>{
    return this.chatSocket.fromEvent('leftRoom')
  }

  recieveMessage(): Observable<Message>{
    return this.chatSocket.fromEvent('recieveMessage')
  }

  sendMessage(message: Message){
    this.chatSocket.emit("chatToRoom", message);
  }
}