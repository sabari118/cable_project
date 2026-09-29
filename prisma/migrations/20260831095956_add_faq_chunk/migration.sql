-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "AIROLE" AS ENUM ('user', 'assistant');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "Email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Operater" (
    "operater_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operater_pkey" PRIMARY KEY ("operater_id")
);

-- CreateTable
CREATE TABLE "Address" (
    "address_id" TEXT NOT NULL,
    "door_no" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "identifier" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" TEXT NOT NULL,
    "payed_amounts" TEXT,
    "razorpayer_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "userID" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Attachemant" (
    "attachemant_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "address_ID" TEXT NOT NULL,
    "create_user_id" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachemant_pkey" PRIMARY KEY ("attachemant_id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "chat_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Operater_Email_key" ON "Operater"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_identifier_key" ON "Permission"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToUser_AB_unique" ON "_ChannelToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToUser_B_index" ON "_ChannelToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToOrder_AB_unique" ON "_ChannelToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToOrder_B_index" ON "_ChannelToOrder"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operater" ADD CONSTRAINT "Operater_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachemant" ADD CONSTRAINT "Attachemant_address_ID_fkey" FOREIGN KEY ("address_ID") REFERENCES "Address"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachemant" ADD CONSTRAINT "Attachemant_create_user_id_fkey" FOREIGN KEY ("create_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("identifier") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToOrder" ADD CONSTRAINT "_ChannelToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToOrder" ADD CONSTRAINT "_ChannelToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
