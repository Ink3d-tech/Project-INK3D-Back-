import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { DiscountsModule } from './discounts/discounts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    DiscountsModule,
    NotificationsModule,
    PaymentMethodsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
