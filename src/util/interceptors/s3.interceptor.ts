import { BadRequestException, CallHandler, ExecutionContext, Inject, mixin, NestInterceptor } from "@nestjs/common";
import { AwsService } from "../../aws/aws.service";
import { _FileType } from "../common.interceptor";
import { Files } from "@anthropic-ai/sdk/resources/beta.js";
import { BadRequestError } from "@anthropic-ai/sdk";

export function  S3Interceptor(model:string){
    class S3InterceptorClass implements NestInterceptor{
        constructor(@Inject(AwsService) public readonly awsService:AwsService){}
async intercept(context: ExecutionContext, next: CallHandler) {
  const req = context.switchToHttp().getRequest();

  // Multiple files
  if (req.files && req.files.length > 0) {
    const result: _FileType[] = [];
    for (let file of req.files) {
      const halfMB = 500000;
      if (file.size > halfMB) {
        throw new BadRequestException('file size is bigger');
      }
      const mime = file.mimetype.split('/')[1];
      const filePath = `${model}/${crypto.randomUUID()}.${mime}`;
      await this.awsService.uploadfile(filePath, file.buffer, file.mimetype);
      file.s3Path = filePath;
      result.push(file);
    }
    req.uploads = result;

  // Single file  ✅ this is your case
  } else if (req.file) {
    const file = req.file;
    const halfMB = 500000;
    if (file.size > halfMB) {
      throw new BadRequestException('file size is bigger');
    }
    const mime = file.mimetype.split('/')[1];
    const filePath = `${model}/${crypto.randomUUID()}.${mime}`;
    await this.awsService.uploadfile(filePath, file.buffer, file.mimetype);
    file.s3Path = filePath;
    req.uploads = file;  // single file, not array

  } else {
    throw new BadRequestException('No file uploaded');
  }

  return next.handle();
}
        
    }

    return mixin(S3InterceptorClass)
}