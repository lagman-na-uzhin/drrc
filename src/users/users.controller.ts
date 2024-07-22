import {Controller, Post, Body, Get, Query, Inject} from '@nestjs/common';
import { UserService } from './service/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { type User } from './entity/users.entity';
import { Cache } from 'cache-manager';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {UserResponse} from "./dto/users.response";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
                @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        const user = await this.userService.createUser(createUserDto);
        console.log(user, 'user')
        return { statusCode: 200, message: 'SUCCESS', user } as UserResponse;
    }

    @Get('get-user-by-id')
    async getUserById(@Query('id') id: number): Promise<UserResponse> {

        // работа с ключами должно быть отдельным  кэш-контроллером,сервисом, но пока так
        const cacheKey = `user-${id}`;
        let user = await this.cacheManager.get<User>(cacheKey);

        if (!user) {
            user = await this.userService.getUserById(id);
            await this.cacheManager.set(cacheKey, user, 1800 );
        }

        return { statusCode: 200, message: 'SUCCESS', user } as UserResponse;
    }
}
