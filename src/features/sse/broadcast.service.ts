import { UserEvents } from '../users/event/users.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '../users/entities';

@Injectable()
export class BroadcastService {
  @OnEvent(UserEvents.CREATED)
  async onUserCreated(user: User) {
    // Send a welcome email to the new user
  }

  @OnEvent(UserEvents.UPDATED)
  async onUserUpdated(user: User) {
    // Update the user's profile on the website
  }

  @OnEvent(UserEvents.DELETED)
  async onUserDeleted(user: User) {
    // Delete the user's profile from the website
  }
}
