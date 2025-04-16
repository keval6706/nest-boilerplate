import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { Session } from '../entities/session.entity';
import { User } from '../entities/user.entity';

export class CreateSessionTable1742576609039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const session = queryRunner.connection.getMetadata(Session);
    const user = queryRunner.connection.getMetadata(User);

    await queryRunner.createTable(
      new Table({
        name: session.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v1()',
          },
          { name: 'userId', type: 'uuid' },
          { name: 'ipAddress', type: 'inet', isNullable: true },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: user.tableName,
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndices(session.tableName, [
      new TableIndex({
        name: 'a273315d-e564-4ed3-9d86-b7c0dafa1d0a',
        columnNames: ['userId'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const session = queryRunner.connection.getMetadata(Session);
    const table = await queryRunner.getTable(session.tableName);
    if (table) {
      for (const foreignKey of table.foreignKeys) {
        await queryRunner.dropForeignKey(table, foreignKey);
      }

      for (const index of table.indices) {
        await queryRunner.dropIndex(table, index);
      }
      await queryRunner.dropTable(table);
    }
  }
}
