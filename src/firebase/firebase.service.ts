import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private adminApp: admin.app.App;

  constructor() {
    this.adminApp = admin.app();
  }
  async verifyToken(token:string){
    const decodedToken=await admin.auth().verifyIdToken(token)
    return decodedToken;
  }
}
