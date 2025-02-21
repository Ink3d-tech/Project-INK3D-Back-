import { Module } from '@nestjs/common';
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
import { FileUploadModule } from './file-upload/file-upload.module';
import googleOauthConfg from './config/google-oauth.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm,googleOauthConfg],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService)=> ({
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
     
    }),
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    DiscountsModule,
    NotificationsModule,
    PaymentMethodsModule,
    AuthModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
