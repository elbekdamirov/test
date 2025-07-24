import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserFilterDto } from "./dto/user-filer.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto);
  }

  findAll() {
    return this.userRepo.find({ relations: ["posts"] });
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`Bunday ${id}-lik user yo'q`);
    }
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepo.delete(id);
    return { message: `User with id ${id} has been removed` };
  }

  async findAllFilter(filter: UserFilterDto): Promise<User[]> {
    const query = this.userRepo.createQueryBuilder("user");
    const { search, sort, page, limit } = filter;
    if (search) {
      query.andWhere("user.name iLIKE :search", {
        search: `%${search}%`,
      });
    }

    if (sort !== undefined) {
      query.orderBy("user.name", sort ? "ASC" : "DESC");
    }

    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }
    return query.getMany();
  }
}
