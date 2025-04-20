import {Controller, Get} from "@nestjs/common";

@Controller()
export class HealthcheckController {

  @Get('healthcheck')
  healthcheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}