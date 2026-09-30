import { Body, Controller, Post, Query, Res, Sse, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { ApiAuthGuard } from "../auth/jwt_guard";
import { CurrentUser, Permisssions } from "../decorator";
import { User } from "@prisma/client";
import { UserDto } from "../auth/dto/create-auth.dto";
import { PermissionGuard } from "../auth/permission.guard";
import { Permission, Roles_Enum } from "../util";
import { Observable } from "rxjs";
import express from "express";

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(ApiAuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'role', enum: [Roles_Enum.ROLE_USER]})
  @Permisssions(Permission.USER_PERMISSION)
  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI assistant' })
  @ApiBody({
    schema: {
      example: {
        message: 'What channels do you offer?',
      }
    }
  })

  async chat(@Body() body: { message: string; },@CurrentUser() user:any) {
  const result = await this.aiService.chat(body.message,user.user_id);
  return result; 
}

//   @Sse('chat-stream')
//   chatStream(@Query('message') message:string):Observable<MessageEvent>{
//   return this.aiService.chatStream(message);
//  } 

// @Post('chat/stream')
//   @ApiBody({
//     schema: {
//       example: {
//         message: 'What channels do you offer?',
//         user_id: 'user-123'
//       }
//     }
//   })
// async chatStream(
//   @Body() body: { message: string; user_id: string },
//   @Res() res: express.Response,
// ) {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   try {
//     await this.aiService.chatStream(body.message, body.user_id, res);
//   } catch (err) {
//     res.write(`data: ${JSON.stringify({ type: 'error', message: 'Something went wrong' })}\n\n`);
//   } finally {
//     res.end();
//   }
// }
}