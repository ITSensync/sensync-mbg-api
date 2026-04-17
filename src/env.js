import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  WS_PORT: z.coerce.number().default(3002),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().default(""),
  DB_USER: z.string().default(""),
  DB_PASSWORD: z.string().default(""),
  DB_LOGGING: z.stringbool().default(false),
  CRON_TIMEZONE: z.string().default("Asia/Jakarta"),
  MAIN_READING_CRON: z.string().default("* * * * *"),
  MAIN_SERVER: z.url().default("http://secure.getsensync.com/sensync-mbg/api/insert.php"),
});

function validateRequiredDatabaseEnv(env) {
  if (env.NODE_ENV === "test") {
    return;
  }

  const missingVariables = ["DB_NAME", "DB_USER"].filter(key => !env[key]);

  if (missingVariables.length > 0) {
    console.error("Missing environment variables:", missingVariables);
    process.exit(1);
  }
}

try {
  // eslint-disable-next-line node/no-process-env
  validateRequiredDatabaseEnv(envSchema.parse(process.env));
}
catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Missing environment variables:", error.issues.flatMap(issue => issue.path));
  }
  else {
    console.error(error);
  }
  process.exit(1);
}

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
