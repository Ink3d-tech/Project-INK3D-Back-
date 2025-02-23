<<<<<<< HEAD
import { Module } from '@nestjs/common';
=======
import { Module, OnModuleInit } from '@nestjs/common';
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { DiscountsModule } from './discounts/discounts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
<<<<<<< HEAD
import { FileUploadModule } from './file-upload/file-upload.module';
import googleOauthConfg from './config/google-oauth.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm,googleOauthConfg],
=======
import googleOauthConfg from './config/google-oauth.config';
import { SeederModule } from './seeds/seeder.module';
import { SeederService } from './seeds/seeder.service';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { Discounts } from './entities/discounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, User, Order, Discounts]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm, googleOauthConfg],
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
<<<<<<< HEAD
      useFactory: (config: ConfigService)=> ({
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
     
    }),
=======
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    DiscountsModule,
    NotificationsModule,
    PaymentMethodsModule,
    AuthModule,
<<<<<<< HEAD
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
=======
    SeederModule,
  ],
  providers: [SeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seed();
  }
}
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
