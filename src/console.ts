import { BootstrapConsole } from 'nestjs-console';
import { ConsoleAppModule } from './consoleApp.module';

BootstrapConsole.init({ module: ConsoleAppModule })
  .then(({ app, boot }) => {
    boot(process.argv);
  })
  .catch(e => console.log('Error', e));
