import { Controller, Post, Get, Body } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  async addToWaitlist(@Body() body: { email: string }) {
    return this.waitlistService.addToWaitlist(body.email);
  }

  @Get('count')
  async getWaitlistCount() {
    return this.waitlistService.getWaitlistCount();
  }
}
