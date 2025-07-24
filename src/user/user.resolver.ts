import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { filter } from "rxjs";
import { UserFilterDto } from "./dto/user-filer.dto";

@Resolver("user")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  findAllUsers() {
    return this.userService.findAll();
  }

  @Query(() => User)
  findOneUser(@Args("id", { type: () => ID }) id: number) {
    return this.userService.findOne(+id);
  }

  @Mutation(() => User)
  createUser(@Args("createUser") createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Mutation(() => User)
  updateUser(
    @Args("id", { type: () => ID }) id: number,
    @Args("updateUser") updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Mutation(() => String)
  removeUser(@Args("id", { type: () => ID }) id: number) {
    return this.userService.remove(+id);
  }

  @Query(() => [User])
  async findAllUsersFilter(@Args("") filter: UserFilterDto): Promise<User[]> {
    return this.userService.findAllFilter(filter);
  }
}