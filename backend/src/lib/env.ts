import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(3333),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres'),

  JWT_EXPIRES_IN: z.string().min(1).default('3d'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('\n❌ Variáveis de ambiente inválidas:\n')

  for (const issue of parsedEnv.error.issues) {
    console.error(`  • ${issue.path.join('.')}: ${issue.message}`)
  }

  console.error(
    '\nCopie o arquivo .env.example para .env e preencha os valores.\n',
  )

  // Encerra o processo: subir a aplicacao mal configurada e pior do que nao subir.
  process.exit(1)
}

export const env = parsedEnv.data
