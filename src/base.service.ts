import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, In, Brackets } from 'typeorm';

@Injectable()
export class BaseService<T> {
  constructor(public repo: Repository<T>) {}

  public getRepo() {
    return this.repo;
  }

  public async findOne(
    options: Partial<T> = {},
    relations: string[] = [],
  ): Promise<T> {
    return this.repo.findOne({
      where: options,
      relations,
    });
  }

  public async findAll(
    options: Partial<T> = {},
    relations: string[] = [],
  ): Promise<T[]> {
    return this.repo.find({
      where: options,
      relations,
    });
  }

  public async create(
    values: Partial<T>,
    relations: string[] = [],
  ): Promise<T> {
    const newEntity = this.repo.create(values as any);
    const savedEntity = await this.repo.save(newEntity as any);

    // We preform this extra DB operation since this will load
    // any needed relations for the entity.
    return this.repo.findOne({ where: { id: savedEntity.id }, relations });
  }

  public async findOrCreate(
    options: Partial<T>,
    defaults: Partial<T> = {},
  ): Promise<[T, boolean]> {
    const existing = await this.findOne(options);
    if (existing) {
      return [existing, false];
    }

    const newEntry = await this.create({ ...options, ...defaults });
    return [newEntry, true];
  }

  public async update(options: Partial<T>, values: Partial<T>) {
    return this.repo.update(options as any, values as any);
  }

  public async delete(options: Partial<T>) {
    return this.repo.delete(options as any);
  }

  public async save(entry: T) {
    return this.repo.save(entry);
  }

  public async findPage(
    options: Partial<T>,
    page: number,
    pageSize: number,
    relations: string[] = [],
  ) {
    const [results, count] = await this.repo.findAndCount({
      where: options,
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations,
    });

    return { results, count };
  }

  public async findOneWithUser(options: Partial<T>, userIds: string[]) {
    return this.repo
      .createQueryBuilder('t')
      .where('t.userId IN (:...userIds)', { userIds })
      .getOne();
  }

  public async findAllWithUser(options: Partial<T>, userIds: string[]) {
    return this.repo
      .createQueryBuilder('t')
      .where('t.userId IN (:...userIds)', { userIds })
      .getMany();
  }

  public async count(options: Partial<T>) {
    return this.repo.count(options);
  }

  public async updateOrCreate(
    options: Partial<T>,
    values: Partial<T>,
  ): Promise<T> {
    const existingEntry = await this.repo.findOne(options);

    if (existingEntry) {
      await this.repo.update(options as any, values as any);
      return this.repo.findOne(options);
    } else {
      const newEntry = this.repo.create(values as any);
      return this.repo.save(newEntry as any);
    }
  }

  public buildLikeQuery(likeQuery: string, possibleFields: string[]) {
    if (possibleFields.length < 2) {
      throw new InternalServerErrorException(
        'buildLikeQuery should only be called with 2 or more possible fields',
      );
    }

    return new Brackets(qb => {
      qb = qb.where(`LOWER(${possibleFields[0]}) LIKE LOWER(:likeQuery)`, {
        likeQuery: `%${likeQuery}%`,
      });
      possibleFields.slice(1).forEach(field => {
        qb = qb.orWhere(`LOWER(${field}) LIKE LOWER(:likeQuery)`, {
          likeQuery: `%${likeQuery}%`,
        });
      });

      return qb;
    });
  }
}
