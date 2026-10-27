import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

// ConfigService.getOrThrow()로 읽는 환경변수는 모두 여기에 선언한다.
// 기본값이 있는 항목은 미설정 시 기본값이 적용되고, 나머지는 기동 시 즉시 실패한다.
export class EnvironmentVariables {
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  // 예: 1h, 30m, 7d
  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string = '1h';

  @IsInt()
  @Min(4)
  @Max(31)
  BCRYPT_SALT_ROUNDS: number = 10;

  @IsUrl({ require_tld: false })
  IDP_USERINFO_URL!: string;

  @IsInt()
  @Min(1)
  IDP_HTTP_TIMEOUT_MS: number = 5000;

  @IsString()
  @IsNotEmpty()
  INFOTEAM_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  INFOTEAM_CLIENT_SECRET!: string;

  @IsUrl({ require_tld: false })
  INFOTEAM_AUTH_URL!: string;

  @IsUrl({ require_tld: false })
  INFOTEAM_TOKEN_URL!: string;

  @IsUrl({ require_tld: false })
  INFOTEAM_CALLBACK_URL!: string;

  @IsUrl({ require_tld: false })
  PUSH_SERVER_URL!: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(validated);
  if (errors.length > 0) {
    const details = errors
      .map(
        ({ property, constraints }) =>
          `- ${property}: ${Object.values(constraints ?? {}).join(', ')}`,
      )
      .join('\n');
    throw new Error(`환경변수 검증 실패:\n${details}`);
  }

  return validated;
}
