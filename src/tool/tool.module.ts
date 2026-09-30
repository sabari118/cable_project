import { Module } from "@nestjs/common";
import { ToolsExecutorService } from "./toolexecutor";
import { OrderModule } from "../order/order.module";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
    imports:[OrderModule],
    controllers:[],
    providers:[ToolsExecutorService,PrismaService]
})
export class ToolModule{}