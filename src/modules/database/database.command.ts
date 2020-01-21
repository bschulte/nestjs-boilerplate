import { Console, Command } from 'nestjs-console';
import prompts from 'prompts';

import { getConnection } from 'typeorm';

@Console()
export class DatabaseCommand {
  @Command({
    command: 'sync-db',
    description:
      'Syncs the database models with the database. [WARNING]: This is a destructive operation',
  })
  public async syncDb() {
    const { confirmed } = await prompts({
      type: 'confirm',
      name: 'confirmed',
      message:
        'This will sync database models with the actual database. [WARNING]: This is a destructive operation',
    });

    if (!confirmed) {
      process.exit(0);
    }

    await getConnection().synchronize();

    process.exit();
  }
}
