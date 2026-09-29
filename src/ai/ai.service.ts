import {Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import Groq from 'groq-sdk';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { ToolsExecutorService } from 'src/tool/toolexecutor';
import { buildSystemPrompt } from 'src/prompts/system.prompt';
import { buildAiTool } from 'src/tool/toolSDK';
import { stepCountIs } from 'ai';


@Injectable()
export class AiService {
  private client: Groq;

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly toolsExecutor: ToolsExecutorService,
  ) {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

//   async chat(userMessage: string, user_id: string): Promise<any> {
//     if (!userMessage || !userMessage.trim()) {
//       return { reply: 'Please type a message.' };
//     }
//     if (!user_id) {
//       return { reply: 'Missing user information. Please login again.' };
//     }

//     let user;
//     try {
//       user = await this.prisma.user.findUnique({ where: { user_id } });
//     } catch (error) {
//       console.error('DB error fetching user:', error);
//       return { reply: 'Something went wrong on our end. Please try again.' };
//     }

//     if (!user) {
//       return { reply: 'User not found. Please login again.' };
//     }

//     try {
//       await this.prisma.chatMessage.create({
//         data: { user: { connect: { user_id } }, role: 'user', content: userMessage },
//       });
//     } catch (error) {
//       console.error('DB error saving user message:', error);
//       return { reply: 'Something went wrong saving your message. Please try again.' };
//     }

//     let history;
//     try {
//       history = await this.prisma.chatMessage.findMany({
//         where: { userID: user_id },
//         orderBy: { createAt: 'desc' },
//         take: 10,
//       });
//       history.reverse();
//     } catch (error) {
//       console.error('DB error fetching history:', error);
//       return { reply: 'Something went wrong loading your conversation. Please try again.' };
//     }

//     let contextText = '';
//     try {
//       const relevantChunks = await this.embeddingService.findRelevantChunks(
//         this.prisma,
//         userMessage,
//         2,
//       );
//       const goodMatches = relevantChunks.filter((chunk) => chunk.score > 0.3);
//       if (goodMatches.length > 0) {
//         contextText = goodMatches.map((c) => `- ${c.content}`).join('\n');
//       }
//     } catch (error) {
//       console.error('RAG retrieval failed:', error);
//     }

//     const messages: any[] = [
//       { role: 'system', content: buildSystemPrompt(contextText) },
//       ...history.map((msg) => ({
//         role: msg.role as 'user' | 'assistant',
//         content: msg.content,
//       })),
//     ];

//     return this.runToolLoop(messages, user, user_id);
//   }

// async runToolLoop(messages: any[], user: any, user_id: string): Promise<any> {
//     const MAX_ITERATIONS = 6;
//     let iterations = 0;

//     while (true) {
//       iterations++;
//       if (iterations > MAX_ITERATIONS) {
//         console.error('Tool-call loop exceeded max iterations for user:', user_id);
//         return { reply: 'Sorry, I got stuck processing that. Please try again or rephrase your request.' };
//       }

//       let response;
//       try {
//         response = await this.client.chat.completions.create({
//           model: 'openai/gpt-oss-120b',
//           max_tokens: 1024,
//           tools: tools,
//           messages,
//         });
//       } catch (error) {
//         console.error('Groq API error:', error);
//         return { reply: "I'm having trouble responding right now. Please try again in a moment." };
//       }

//       const responseMessage = response.choices[0].message;

//       if (responseMessage.content && responseMessage.tool_calls?.length) {
//         console.log(`🧠 [Agent Reasoning] ${responseMessage.content}`);
//       }

//       messages.push(responseMessage);

//       if (!responseMessage.tool_calls?.length) {
//         const aiReply = responseMessage.content ?? '';

//         try {
//           await this.prisma.chatMessage.create({
//             data: { user: { connect: { user_id } }, role: 'assistant', content: aiReply },
//           });
//         } catch (error) {
//           console.error('DB error saving assistant reply:', error);
//         }

//         return { reply: aiReply };
//       }

//       await this.executeToolCalls(responseMessage.tool_calls, messages, user);
//     }
//   }

//   async executeToolCalls(toolCalls: any[], messages: any[], user: any): Promise<void> {
//     for (const toolCall of toolCalls) {
//       const toolName = toolCall.function.name;

//       let toolArgs: any;
//       try {
//         toolArgs = JSON.parse(toolCall.function.arguments || '{}');
//       } catch (error) {
//         console.error('Failed to parse tool arguments:', toolCall.function.arguments, error);
//         messages.push({
//           role: 'tool',
//           tool_call_id: toolCall.id,
//           content: JSON.stringify({
//             success: false,
//             message: 'Invalid arguments received. Please retry with valid arguments.',
//           }),
//         });
//         continue;
//       }

//       let toolResult: any;
//       try {
//         toolResult = await this.dispatchTool(toolName, toolArgs, user);
//       } catch (error) {
//         console.error(`Tool execution failed for ${toolName}:`, error);
//         toolResult = { success: false, message: 'Something went wrong executing that action.' };
//       }

//       messages.push({
//         role: 'tool',
//         tool_call_id: toolCall.id,
//         content: JSON.stringify(toolResult),
//       });
//     }
//   }

//   async dispatchTool(toolName: string, toolArgs: any, user: any): Promise<any> {
//     switch (toolName) {
//       case 'getChannels':
//         return this.toolsExecutor.getChannels();

//       case 'checkUserSubscription':
//         if (!toolArgs.channelId) {
//           return { subscribed: false, message: 'channelId is required.' };
//         }
//         return this.toolsExecutor.checkUserSubscription(toolArgs.channelId, user.user_id);

//       case 'subscribeChannel':
//         if (!toolArgs.channelId) {
//           return { success: false, message: 'channelId is required.' };
//         }
//         return this.toolsExecutor.subscribeChannel(toolArgs.channelId, { user_id: user.user_id });

//       default:
//         return { success: false, message: `Unknown tool: ${toolName}` };
//     }
//   } manual part 



  async chat(userMessage: string, user_id: string): Promise<any> {
      if (!userMessage || !userMessage.trim()) {
        return { reply: 'Please type a message.' };
      }
      if (!user_id) {
        return { reply: 'Missing user information. Please login again.' };
      }

      let user;
      try {
        user = await this.prisma.user.findUnique({ where: { user_id } });
      console.log(user)
      } catch (error) {
        console.error('DB error fetching user:', error);
        return { reply: 'Something went wrong on our end. Please try again.' };
      }

      if (!user) {
        return { reply: 'User not found. Please login again.' };
      }

      try {
        await this.prisma.chatMessage.create({
          data: { user: { connect: { user_id } }, role: 'user', content: userMessage },
        });
      } catch (error) {
        console.error('DB error saving user message:', error);
        return { reply: 'Something went wrong saving your message. Please try again.' };
      }

      let history;
      try {
        history = await this.prisma.chatMessage.findMany({
          where: { userID: user_id },
          orderBy: { createAt: 'desc' },
          take: 10,
        });
        history.reverse();
      } catch (error) {
        console.error('DB error fetching history:', error);
        return { reply: 'Something went wrong loading your conversation. Please try again.' };
      }

      let contextText = '';
      try {
        const relevantChunks = await this.embeddingService.findRelevantChunks(
          this.prisma,
          userMessage,
          2,
        );
        const goodMatches = relevantChunks.filter((chunk) => chunk.score > 0.3);
        if (goodMatches.length > 0) {
          contextText = goodMatches.map((c) => `- ${c.content}`).join('\n');
        }
      } catch (error) {
        console.error('RAG retrieval failed:', error);
      }

  const messages: any[] = history.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));
  const dynamicImport = new Function('specifier', 'return import(specifier)');

  const { generateText, stepCountIs } = await dynamicImport('ai');
  const { groq } = await dynamicImport('@ai-sdk/groq');
      const tools = await  buildAiTool(this.toolsExecutor, user_id);

      let result;
      try {
        result = await generateText({
          model: groq('openai/gpt-oss-120b'),
          system: buildSystemPrompt(contextText),
          tools,
          stopWhen: stepCountIs(6),
          messages,
        });
      } catch (error) {
        console.error('AI SDK error:', error);
        return { reply: "I'm having trouble responding right now. Please try again in a moment." };
      }

      const aiReply = result.text ?? '';

      try {
        await this.prisma.chatMessage.create({
          data: { user: { connect: { user_id } }, role: 'assistant', content: aiReply },
        });
      } catch (error) {
        console.error('DB error saving assistant reply:', error);
      }

      return { reply: aiReply };
    }
}
  





