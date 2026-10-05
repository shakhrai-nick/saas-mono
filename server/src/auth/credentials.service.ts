import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service.js";
import { PasswordHasher } from "@nestjs/authentication";
import { User } from "../users/entities/user.entity.js";
import { CreateUserDto } from "../users/dto/create-user.dto.js";

@Injectable()
export class CredentialsService {
    constructor (private readonly usersService: UsersService, private readonly hasher: PasswordHasher) {};

    async register(dto: CreateUserDto): Promise<User> {
        if (await this.usersService.findByEmail(dto.email)) {
            throw new ConflictException("Account already exists!");
        }
        const newUser = await this.usersService.create({ email: dto.email, password: await this.hasher.hash(dto.password)});
        return newUser;
    }

    async verify(dto: { email: string, password: string }): Promise<User | null> {
        const found = await this.usersService.findCredentials(dto.email);
        
        const valid = await this.hasher.verify(dto.password, found?.passwordHash);

        if (!valid || !found?.passwordHash) return null;

        if (await this.hasher.needsRehash(found.passwordHash)) {
            await this.usersService.updatePasswordHash(found.id, await this.hasher.hash(dto.password));
        }

        return found;
    }
}