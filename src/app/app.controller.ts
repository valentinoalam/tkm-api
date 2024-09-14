import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { AtGuard } from '@/common/guards';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req): string {
    console.log(req.user.id);
    return this.appService.getHello();
  }
}
