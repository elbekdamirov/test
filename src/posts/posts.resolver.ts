import { Controller, Get, Body, Patch, Param, Delete } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserResolver } from "src/user/user.resolver";
import { Post } from "./entities/post.entity";

@Resolver("posts")
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly userResolver: UserResolver
  ) {}

  @Mutation(() => Post)
  async createPosts(
    @Args("createPost") createPostDto: CreatePostDto,
    @Args("authorId", { type: () => ID }) authorId: number
  ) {
    console.log(createPostDto);
    const author = await this.userResolver.findOneUser(authorId);
    return this.postsService.createWithAuthor(createPostDto, author!);
  }

  @Query(() => [Post])
  findAllPosts() {
    return this.postsService.findAll();
  }

  @Query(() => Post)
  findOnePost(@Args("id", { type: () => ID }) id: number) {
    return this.postsService.findOne(+id);
  }

  @Mutation(() => Post)
  updatePost(
    @Args("id", { type: () => ID }) id: number,
    @Args("updatePost") updatePostDto: UpdatePostDto
  ) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Mutation(() => Number)
  remove(@Args("id", { type: () => ID }) id: string) {
    return this.postsService.remove(+id);
  }
}
