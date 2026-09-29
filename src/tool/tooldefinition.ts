//   export const  tools=[
//     {
//       type:'function' as const,
//       function:{
//         name:'getChannels',
//         description:'Get all available channels from the database. Use this when user asks about available channels or pricing.',
//         parameters:{
//           type:'object',
//           properties:{},
//           required:[],
//         },
//       },
//     },
//     {
//       type:'function' as const,
//       function:{
//         name:'subscribeChannel',
//         description:'Create an order to subscribe a user to one or more channels. Use this when user wants to subscribe to a channel.',
//         parameters:{
//           type:'object',
//           properties:{
//             channelId:{
//               type:'array',
//               items:{type:'string'},
//               description: 'Array of channel IDs the user wants to subscribe to',
//             },
//           },
//           required:['channelId']
//         },
//       },
//     },{
//   type: 'function' as const,
//   function: {
//     name: 'checkUserSubscription',
//     description: 'Check if the user already has an active (successful) subscription to a specific channel. ALWAYS call this before subscribeChannel, to avoid subscribing a user twice.',
//     parameters: {
//       type: 'object',
//       properties: {
//         channelId: {
//           type: 'string',
//           description: 'The channel ID to check subscription status for',
//         },
//       },
//       required: ['channelId'],
//     },
//   },
// },
//   ]