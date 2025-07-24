import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}
