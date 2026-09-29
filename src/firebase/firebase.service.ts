// import { Injectable } from '@nestjs/common';
// import * as admin from 'firebase-admin';
// import { ServiceAccount } from 'firebase-admin';
// import * as serviceAccount from '../auth/fcm.json';

// @Injectable()
// export class FirebaseService {
  

//   constructor() {
//       if (admin.apps.length === 0) {
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount as ServiceAccount),
//       });
//     }
//   }
//   async verifyToken(token:string){
//     const decodedToken=await admin.auth().verifyIdToken(token)
//     return decodedToken;
//   }
// }

