import { Console, Command } from 'nestjs-console';
import { UserService } from './user.service';
import chalk from 'chalk';
import * as bcrypt from 'bcryptjs';
import prompts, { PromptObject } from 'prompts';

@Console()
export class UserCommand {
  constructor(private readonly userService: UserService) {}

  @Command({
    command: 'create-user <email>',
    description: 'Create a new user. Password will be generated and displayed',
  })
  public async createUser(email: string) {
    const { generatedPassword } = await this.userService.createUser(email);
    console.log('Generated password:', chalk.red(generatedPassword));
    process.exit(0);
  }

  @Command({
    command: 'change-pass',
    description: 'Change the password of a user',
  })
  public async changePassword() {
    const users = await this.userService.findAll();

    const questions: PromptObject[] = [
      {
        type: 'select',
        message: 'Select a user',
        name: 'userIndex',
        choices: users.map((user, index) => ({
          title: user.email,
          value: index,
        })),
      },
      {
        type: 'password',
        message: 'New password',
        name: 'newPassword',
      },
      {
        type: 'password',
        message: 'Type password again',
        name: 'dupePassword',
      },
    ];
    const { userIndex, newPassword, dupePassword } = await prompts(questions);

    if (newPassword !== dupePassword) {
      console.log(chalk.yellow('Passwords do not match'));
      process.exit(-1);
    }

    const user = users[userIndex];
    if (!user) {
      console.log(chalk.yellow('Could not find user from index:', userIndex));
      process.exit(-2);
    }

    await this.userService.update(
      { id: user.id },
      {
        password: bcrypt.hashSync(newPassword, 10),
      },
    );

    console.log('Updated user password');
    process.exit(0);
  }
}
