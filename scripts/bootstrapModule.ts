import * as fs from 'fs';

function safeWriteFile(file: string, content: string) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
  }
}

(() => {
  const name: string = process.argv[2];
  const uppercaseName = name.charAt(0).toUpperCase() + name.slice(1);

  console.log(`Bootstrapping ${name}/${uppercaseName}`);

  // Folder first
  const dir = __dirname + '/../src/modules/' + name;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Entity
  const entity = `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ${uppercaseName} {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}`;
  safeWriteFile(dir + '/' + name + '.entity.ts', entity);

  // Service
  const service = `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base.service';

import { BackendLogger } from '../logger/BackendLogger';
import { ${uppercaseName} } from './${name}.entity';

@Injectable()
export class ${uppercaseName}Service extends BaseService<${uppercaseName}> {
  private readonly logger = new BackendLogger(${uppercaseName}Service.name);

  constructor(
    @InjectRepository(${uppercaseName})
    private readonly ${name}Repo: Repository<${uppercaseName}>,
  ) {
    super(${name}Repo);
  }
}`;

  safeWriteFile(dir + '/' + name + '.service.ts', service);

  // Controller
  const controller = `import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';

import { BackendLogger } from '../logger/BackendLogger';
import { ${uppercaseName}Service } from './${name}.service';

@Controller('${name}')
@UseGuards(AuthGuard)
export class ${uppercaseName}Controller {
  private readonly logger = new BackendLogger(${uppercaseName}Controller.name);

  constructor(private readonly ${name}Service: ${uppercaseName}Service) {}
}`;
  safeWriteFile(dir + '/' + name + '.controller.ts', controller);

  // Module
  const module = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${uppercaseName} } from './${name}.entity';
import { ${uppercaseName}Service } from './${name}.service';
import { ${uppercaseName}Controller } from './${name}.controller';
import { ${uppercaseName}Resolver } from './${name}.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([${uppercaseName}])],
  controllers: [${uppercaseName}Controller],
  providers: [${uppercaseName}Service, ${uppercaseName}Resolver],
  exports: [${uppercaseName}Service]
})
export class ${uppercaseName}Module {}`;
  safeWriteFile(dir + '/' + name + '.module.ts', module);

  // Spec file
  const spec = `import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ${uppercaseName} } from './${name}.entity'
import { ${uppercaseName}Service } from './${name}.service';

describe('${uppercaseName}Service', () => {
  let ${name}Service: ${uppercaseName}Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([${uppercaseName}])],
      providers: [${uppercaseName}Service]
    }).compile();

    ${name}Service = module.get<${uppercaseName}Service>(${uppercaseName}Service);
  });

});`;
  safeWriteFile(dir + '/' + name + '.service.spec.ts', spec);

  // Resolver
  const resolver = `import { Args, Query, Resolver, Context } from '@nestjs/graphql';
import { ${uppercaseName} } from './${name}.entity';
import { ${uppercaseName}Service } from './${name}.service';
import { RequestWithUser } from 'src/shared/types';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Resolver(of => ${uppercaseName})
@UseGuards(AuthGuard)
export class ${uppercaseName}Resolver {
  constructor(
    private readonly ${name}Service: ${uppercaseName}Service,
  ) {}

  @Query(returns => ${uppercaseName})
  public async ${name}(
    @Context('req') { user }: RequestWithUser,
    @Args('id') id: string,
  ) {
    return this.${name}Service.findOne({ id });
  }
}`;
  safeWriteFile(dir + '/' + name + '.resolver.ts', resolver);
})();
