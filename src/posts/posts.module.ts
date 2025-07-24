import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { Post } from "./entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { UserResolver } from "src/user/user.resolver";
import { PostsResolver } from "./posts.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  controllers: [PostsController],
  providers: [PostsService, UserService, UserResolver, PostsResolver],
})
export class PostsModule {}
