import { ToolsExecutorService } from "./toolexecutor";
import {z} from 'zod'
export async function buildAiTool(toolsExecution:ToolsExecutorService,user_id:string){
    const { tool } = await import('ai');
   
    return {
        getChannels:tool({
            description:'Get all available channels from the database. Use this when user asks about available channels or pricing.',
            inputSchema:z.object({}),
            execute:async ()=>{
                return toolsExecution.getChannels()
            }
        }),
        checkUserSubscription:tool({
            description:'Check if the user already has an active (successful) subscription to a specific channel. ALWAYS call this before subscribeChannel, to avoid subscribing a user twice.',
            inputSchema:z.object({
                channelId:z.string().describe('The channel ID to check subscription status for'),
            }),
            execute: async({channelId})=>{
                return toolsExecution.checkUserSubscription(channelId,user_id)
            }
        }),
        subscribeChannel:tool({
            description:'Create an order to subscribe a user to a channel. Use this only if the user is NOT already subscribed.',
            inputSchema:z.object({
                channelId:z.array(z.string()).describe('Array of channel IDs the user wants to subscribe to'),
            }),
            execute:async({channelId})=>{
                return toolsExecution.subscribeChannel(channelId,{user_id})
            }
        })
    }

}