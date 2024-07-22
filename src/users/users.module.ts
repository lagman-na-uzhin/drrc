import { Module} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserController} from "./users.controller";
import {User} from "./entity/users.entity";
import {UserService} from "./service/users.service";
import {BullModule} from "@nestjs/bull";
import {UserStatusProcessor} from "./processer/user-status.processor";

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
        }),
        TypeOrmModule.forFeature([User]),
        BullModule.registerQueue({
            name: 'user-status',
        }),
    ],
    controllers: [UserController],
    providers: [UserService, UserStatusProcessor],
})
export class UserModule {}
