import { SetMetadata } from "@nestjs/common";

export const Permisssions=(...args:string[])=>
    SetMetadata('permission',args)


