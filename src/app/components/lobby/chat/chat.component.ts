import { Component, Input, OnInit } from '@angular/core';
import { Lobby } from 'src/app/models/lobby.model';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  
  messages: Message[] = []
  messageSend: string = ""

  isConnected = false
  isJoinedRoom = false

  constructor(public chatService: ChatService,
              public authenticationService: AuthenticationService,
              public userService: UserService) { }

  ngOnInit(): void {
    this.initChatSocket()
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.lobby.code)
  }

  sendMessage() {
    if(!this.messageSend.length) return;
    
    const message = new SocketMessage(this.authenticationService.getIdFromToken(), this.messageSend, this.lobby.code, this.lobby.id)
    this.chatService.sendMessage(message)
    this.messageSend = ''
  }

  initChatSocket(){
    this.chatService.connect().subscribe( data => {
        this.isConnected = true
        this.chatService.joinRoom(this.lobby.code)
        console.log('connected!');
    })
    this.chatService.joinedRoom().subscribe( data => {
        this.isJoinedRoom = true
        console.log('joined room!', data);
    })
    this.chatService.leftRoom().subscribe( data => {
        this.isJoinedRoom = false
        console.log('left room!', data);
    })
    this.chatService.recieveMessage().subscribe( message => {
        this.messages.push(message)   
    })
  }

  getUserOfLobbyById(id: number): User {
    const user = this.lobby.users.find(user => user.id === id)
    return user || this.userService.getEmptyUser()
  }

  connectChat(){
    if(this.isJoinedRoom){
      this.chatService.leaveRoom(this.lobby.code)
      this.isJoinedRoom = false;
    }else{
      this.initChatSocket()
    }
  }

}

export class SocketMessage {
  constructor(public user: number, public message: string, public room: string, public lobbyId: number) {}
}
