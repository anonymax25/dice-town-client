import { Observable } from "rxjs";

export interface SocketService {

    connect(): Promise<void>

    connected(): Observable<void>
    
    disconnected(): Observable<void>
}