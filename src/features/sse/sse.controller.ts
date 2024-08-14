import { Controller, Get, Param, Query, Req, Res, Sse } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SseService } from './sse.service';
import { Observable, fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

function createMessageEvent(data: any): MessageEvent {
  const event = new MessageEvent('message', {
    data: JSON.stringify(data),
  });
  return event;
}

@ApiBearerAuth('access-token')
@Controller('sse')
export class SseController {
  constructor(
    private readonly sseService: SseService,
    private eventEmitter: EventEmitter2,
  ) {}
  private readonly sseConnections = new Map<string, EventSource>();

  @Sse('/sse')
  async sse(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Observable<MessageEvent>> {
    const client = this.sseService.handleConnection(req.user['id']);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();
    return this.sseService.sendEvents();
    // return fromEvent(this.eventEmitter, 'sse.event').pipe(
    //   map((payload) => ({
    //     data: JSON.stringify(payload),
    //   })),
    // );
  }

  @Sse('/sse')
  async userSse(): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'sse.event').pipe(
      map((payload) => createMessageEvent(payload)),
    );
  }
  @Sse()
  @Get('/user-events')
  async getUserEvents(req: Request) {
    const sseConnection = new EventSource('/user-events');
    this.sseConnections.set(req.socket.remoteAddress, sseConnection);
    return await this.sseService.sendEvents();
  }
}
