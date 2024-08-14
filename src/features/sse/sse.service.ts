import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private clients: Record<string, Subject<any>> = {};
  private events = new Subject<MessageEvent>();
  private readonly sseConnections = new Map<string, EventSource>();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  addEvent(event: MessageEvent) {
    this.events.next(event);
  }

  sendEvents() {
    return this.events.asObservable();
  }

  handleConnection(id: string) {
    if (!this.clients[id]) {
      this.clients[id] = new Subject();
    }
    return this.clients[id].asObservable();
  }

  handleDisconnection(id: string) {
    if (this.clients[id]) {
      this.clients[id].complete();
      delete this.clients[id];
    }
  }

  emitUpdateToClients(update: any) {
    return Object.values(this.clients).forEach((client) =>
      client.next({ data: update }),
    );
  }
}
