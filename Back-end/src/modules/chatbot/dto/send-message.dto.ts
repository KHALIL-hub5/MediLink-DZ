import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

import { $Enums } from "@prisma/client";

import { AiProvider } from "../providers/ai-models.config";

export class SendMessageDto {
  @IsEnum($Enums.AiProvider)
  provider!: AiProvider;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsUUID()
  @IsOptional()
  conversationId?: string;
}
