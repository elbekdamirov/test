import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>
  ) {}

  async createWithAuthor(createPostDto: CreatePostDto, author: User) {
    const newPost = this.postsRepo.create({ ...createPostDto, author });
    return this.postsRepo.save(newPost);
  }

  findAll() {
    return this.postsRepo.find({ relations: ["author"] });
  }

  findOne(id: number) {
    return this.postsRepo.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const user = await this.postsRepo.preload({ id, ...updatePostDto });
    if (!user) {
      throw new NotFoundException(`Bunday ${id}-lik user yo'q`);
    }
    return this.postsRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.postsRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.postsRepo.delete(id);
    return { message: `User with id ${id} has been removed` };
  }
}
