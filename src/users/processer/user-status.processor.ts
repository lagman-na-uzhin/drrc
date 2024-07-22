import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from "../entity/users.entity";

@Processor('user-status')
export class UserStatusProcessor {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    @Process()
    async handleUserStatus(job: Job<{ userId: number }>): Promise<void> {
        const { userId } = job.data;
        await this.userRepository.update(userId, { status: true });
    }
}
