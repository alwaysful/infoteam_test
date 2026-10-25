import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: '헬스 체크 (Hello World)' })
  @ApiOkResponse({ type: String, example: 'Hello World!' })
  getHello(): string {
    return 'Hello World!';
  }
}
