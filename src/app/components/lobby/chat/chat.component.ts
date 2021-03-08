import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Lobby } from 'src/app/models/lobby.model';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ChatSocketService } from './chat-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Input('refreshChatEventSubject') refreshChatEvent: Observable<void>;
  private refreshChatEventsSubscription: Subscription;

  messages: Message[] = []
  messageSend: string = ""

  isConnected = false
  isJoinedRoom = false

  constructor(public chatSocketService: ChatSocketService,
              public authenticationService: AuthenticationService,
              public userService: UserService) { }

  ngOnInit(): void {
    this.refreshChatEventsSubscription = this.refreshChatEvent.subscribe(() => { this.messages = [] })
    this.initChatSocket()
  }

  ngOnDestroy(): void {
    this.refreshChatEventsSubscription.unsubscribe();
    this.chatSocketService.leaveRoom(this.lobby.code)
  }

  sendMessage() {
    if(!this.messageSend.length) return;
    
    const message = new SocketMessage(this.authenticationService.getIdFromToken(), this.messageSend, this.lobby.code, this.lobby.id)
    this.chatSocketService.sendMessage(message)
    this.messageSend = ''
  }

  initChatSocket(){
    this.chatSocketService.connect().subscribe( data => {
        this.isConnected = true
        this.chatSocketService.joinRoom(this.lobby.code)
        console.log('chat connected!');
    })
    this.chatSocketService.joinedRoom().subscribe( data => {
        this.isJoinedRoom = true
        console.log('joined chat!', data);
    })
    this.chatSocketService.leftRoom().subscribe( data => {
        this.isJoinedRoom = false
        console.log('left chat!', data);
    })
    this.chatSocketService.recieveMessage().subscribe( message => {
        this.messages.push(message)   
    })
  }

  getUserOfLobbyById(id: number): User {
    const user = this.lobby.users.find(user => user.id === id)
    return user || this.userService.getEmptyUser()
  }

  connectChat(){
    if(this.isJoinedRoom){
      this.chatSocketService.leaveRoom(this.lobby.code)
      this.isJoinedRoom = false;
    }else{
      this.initChatSocket()
    }
  }

}

export class SocketMessage {
  constructor(public user: number, public message: string, public room: string, public lobbyId: number) {}
}
