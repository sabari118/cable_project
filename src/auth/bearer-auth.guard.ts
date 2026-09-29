// import { Injectable } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import { FirebaseService } from "src/firebase/firebase.service";
// import { AuthService } from "./auth.service";

// @Injectable()
// export class BearerAuthGuard extends AuthGuard('bearer'){
//     constructor(private firebase:FirebaseService,private auth:AuthService){
//         super({passReqToCallback:true})
//     }

//     async validate(req:Request, token:string){
//         try{
//             const data=await this.firebase.verifyToken(token)
//             return await this.auth.
//         }
//     }
// }