import { Injectable } from '@nestjs/common';
import { AuthenticationRegistry, SessionCookieProvider, SessionRecord } from "@nestjs/authentication";
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService extends SessionCookieProvider<User>{

  constructor (
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry 
  ) {
    super ();
    registry.registerProvider(this);
  }

  validate(session: SessionRecord) {
    return this.usersService.findById(session.userId);
  }
}
