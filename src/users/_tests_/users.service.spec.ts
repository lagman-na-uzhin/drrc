import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BullModule } from '@nestjs/bull';
import {User} from "../entity/users.entity";
import {UserService} from "../service/users.service";
import {Queue} from "bull";

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;
    let userStatusQueue: Queue;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                BullModule.forRoot({
                    redis: { host: 'localhost', port: 6379 },
                }),
                BullModule.registerQueue({
                    name: 'user-status',
                }),
            ],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: 'user-status_queue',
                    useValue: {
                        add: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
        userStatusQueue = module.get<Queue>('user-status_queue');
    });

    it('должен возвращать true, если email уже существует', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue({ id: 1, email: 'ema@gmail.com' } as User);

        const result = await service.emailIsExisting('ema@gmail.com');
        expect(result).toBe(true);
    });

    it('должен возвращать false, если email не существует', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        const result = await service.emailIsExisting('nonexistent@example.com');
        expect(result).toBe(false);
    });

});
