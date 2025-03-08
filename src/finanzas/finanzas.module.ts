import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "src/entities/invoice.entity";
import { Order } from "src/entities/order.entity";
import { Transactions } from "src/entities/transaction.entity";
import { User } from "src/entities/user.entity";
import { FinanzasController } from "./finanzas.controller";
import { FinanzasService } from "./finanzas.service";
import { Product } from "src/entities/product.entity";
import { DetailsVenta } from "src/entities/details-sales.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Transactions,User,Order,Invoice,Product,DetailsVenta])],
    controllers:[FinanzasController],
    providers:[FinanzasService]
})

export class FinanzasModule{}