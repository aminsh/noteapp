import { IsString } from "class-validator";

export class RegisterDTO {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
