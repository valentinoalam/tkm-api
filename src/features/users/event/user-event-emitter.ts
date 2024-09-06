import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '../entities/user.entity';

import { UserEvents } from './users.event';

@Injectable()
export class UserEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emitUserCreatedEvent() {
    await this.eventEmitter.emit(UserEvents.CREATED, {
      message: 'new User has been Created',
    });
  }

  async emitUserUpdatedEvent(user: User) {
    await this.eventEmitter.emit(UserEvents.UPDATED, {
      message: 'User ${user.id} data has been Updated',
      data: user,
    });
  }

  async emitUserDeletedEvent(user: User) {
    await this.eventEmitter.emit(UserEvents.DELETED, {
      message: `User ${user.username} has been Deleted`,
    });
  }
}
