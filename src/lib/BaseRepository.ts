import { AppDataSource } from '@/core/database/data-source';
import { Repository, EntityTarget, ObjectLiteral } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(private entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(this.entity) as Repository<T>;
  }

}
