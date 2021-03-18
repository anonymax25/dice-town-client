import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  isChatConnected = false
  isJoinedChat = false

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(public chatSocketService: ChatSocketService,
              public authenticationService: AuthenticationService,
              public userService: UserService) { }

  ngOnInit(): void {
    this.refreshChatEventsSubscription = this.refreshChatEvent.subscribe(() => { this.messages = [] })
    this.initChatSocket()
    this.scrollToBottom()
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
        this.isChatConnected = true
        this.chatSocketService.joinRoom(this.lobby.code)
        console.log('chat connected!');
    })
    this.chatSocketService.joinedRoom().subscribe( data => {
        this.isJoinedChat = true
        console.log('joined chat!', data);
    })
    this.chatSocketService.leftRoom().subscribe( data => {
        this.isJoinedChat = false
        console.log('left chat!', data);
    })
    this.chatSocketService.recieveMessage().subscribe( message => {
        this.messages.push(message)   
        
        this.scrollToBottom()
    })
  }

  getUserOfLobbyById(id: number): User {
    const user = this.lobby.users.find(user => user.id === id)
    return user || this.userService.getEmptyUser()
  }

  connectChat(){
    if(this.isJoinedChat){
      this.chatSocketService.leaveRoom(this.lobby.code)
      this.isJoinedChat = false;
    }else{
      this.initChatSocket()
    }
  }

  scrollToBottom(): void {
    try {
        setTimeout(() => {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }, 5)
    } catch(err) { 
      
    }                 
  }

}

export class SocketMessage {
  constructor(public user: number, public message: string, public room: string, public lobbyId: number) {}
}
