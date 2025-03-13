import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { DiscountsModule } from './discounts/discounts.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import googleOauthConfig from './config/google-oauth.config';
import { SeederModule } from './seeds/seeder.module';
import { SeederService } from './seeds/seeder.service';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { Discounts } from './entities/discounts.entity';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { StockMovements } from './entities/stock-movement.entiy';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CloudinaryConfig } from './config/cloudinary';
import { Chatbot } from './chatbot/chatbot';
import { MagazineModule } from './magazine/magazine.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { FinanzasModule } from './finanzas/finanzas.module';
import { Transactions } from './entities/transaction.entity';
import { Magazine } from './entities/magazine.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './entities/comment.entity';
import { PerspectiveModule } from './perspective/perspective.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      User,
      Order,
      Discounts,
      StockMovements,
      Transactions,
      Magazine,
      Comment,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm, googleOauthConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    DiscountsModule,
    PaymentMethodsModule,
    AuthModule,
    SeederModule,
    StockMovementsModule,
    NodemailerModule,
    FileUploadModule,
    MagazineModule,
    FinanzasModule,
    CommentModule,
    PerspectiveModule
  ],
  providers: [SeederService, CloudinaryConfig, Chatbot],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seed();
  }
  configure(consumer: MiddlewareConsumer) {
    // Aquí aplicamos el middleware a todas las rutas
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
