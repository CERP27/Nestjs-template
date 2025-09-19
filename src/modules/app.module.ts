import { PrismaService } from '@/common/infrastructure/database/prisma.service';
import { environmentConfig } from '@/config/environment.config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig],
      isGlobal: true,
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
  controllers: [],
})
export class AppModule {}
