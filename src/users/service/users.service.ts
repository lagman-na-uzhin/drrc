import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {User} from "../entity/users.entity";
import {CreateUserDto} from "../dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectQueue('user-status') private userStatusQueue: Queue,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password } = createUserDto;

        const existingUser: boolean = await this.emailIsExisting(email)
        if (existingUser) {
            throw new BadRequestException({ statusCode: 400, message: 'ERR_USER_EMAIL_EXISTS' });
        }

        const user: User = this.userRepository.create({ name, email, password, status: false });
        await this.userRepository.save(user);

        await this.userStatusQueue.add(
            { userId: user.id },
            { delay: 10000 },
        );

        return user;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOneById(id);
        if (!user) {
            throw new BadRequestException({ statusCode: 400, message: 'ERR_USER_NOT_FOUND' });
        }
        return user;
    }

    // Требования 3: "Проверка на уникальность email при создании пользователя, должен быть отдельный UNIT, который должен быть протестирован UNIT тестом"
    async emailIsExisting(email: string): Promise<boolean> {
        const existingUser = await this.userRepository
            .findOne({
                where: { email }
            });
        return !!existingUser
    }
}
