import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import path from 'node:path'

const PRISMA_DIR = path.resolve(import.meta.dirname, '../prisma')

export default function setup() {
  for (const file of ['test.db', 'test.db-journal']) {
    rmSync(path.join(PRISMA_DIR, file), { force: true })
  }

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'ignore',
  })
}
