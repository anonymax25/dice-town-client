import { Component, Input, OnInit } from '@angular/core';
import { Lobby } from 'src/app/models/lobby.model';
import { Message } from 'src/app/models/message';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input('roomId') roomId: string
  @Input('lobby') lobby: Lobby
  
  messages: Message[] = []
  messageSend: string = ""

  isConnected = false
  isJoinedRoom = false

  constructor(public chatService: ChatService,
              public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.initChatSocket()
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.roomId)
  }

  sendMessage(messageStr: string) {
    const message = new SocketMessage(this.authenticationService.getIdFromToken(), messageStr, this.roomId, this.lobby.id)
    console.log(message);
    
    this.chatService.sendMessage(message)
  }

  initChatSocket(){
    this.chatService.connect().subscribe( data => {
        this.isConnected = true
        this.chatService.joinRoom(this.roomId)
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

  getUserOfLobbyById(id: number) {
    return this.lobby.users.find(user => user.id === id)
  }

}

export class SocketMessage {
  constructor(public user: number, public message: string, public room: string, public lobbyId: number) {}
}
