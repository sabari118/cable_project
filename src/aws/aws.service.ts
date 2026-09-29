import { Injectable } from "@nestjs/common";
import{S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
@Injectable()
export class AwsService{
    private readonly s3Client:S3Client;
    private readonly bucket:string;
    constructor(){
        this.s3Client= new S3Client({
            region:process.env.AWS_REGION as string,
            credentials:{
                accessKeyId:process.env.ACCESS_KEY_ID as string,
                secretAccessKey:process.env.SECRET_ACCESS_KEY as string
            },
        })
        this.bucket= process.env.AWS_BUCKET as string;
    }

    private getClient():S3Client{
        return this.s3Client;
    }

    async uploadfile(key:string,data:Buffer,mime:string){
        const common= new PutObjectCommand({
           Bucket:this.bucket,
            Key:key,
            Body:data,
            ContentDisposition:"inline",
            ContentType:mime,
        })
        try{
            const responce= await this.getClient().send(common)
            return responce;
        }catch(error){
            console.log("error",error)
            return null
        }
    }
    async getS3Url(key:string,mime:string){
        const command= new GetObjectCommand({
            Key:key,
            Bucket:this.bucket,
            ResponseContentDisposition:"inline",
            ResponseContentType:mime
        })
        try{
            const url= await getSignedUrl(this.getClient(),command,{expiresIn:3600})
            return url;
        }catch(error){
            console.log("error",error)
            return null;
        }
    }
    async DeleteS3url(key:string){
        const commons=new DeleteObjectCommand({
            Bucket:this.bucket,
            Key:key
        })
        try{
            await this.getClient().send(commons)
            return true
        }catch(error){
            console.log("error",error)
            return null
        }
    }
}