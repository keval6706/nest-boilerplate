import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { UserRole } from "../../enums/user.enum";
import { User } from "../entities/user.entity";

export class CreateUserTable1742576604361 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = queryRunner.connection.getMetadata(User);

    await queryRunner.createTable(
      new Table({
        name: user.tableName,
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v1()",
          },
          { name: "email", type: "varchar", isUnique: true },
          { name: "password", type: "varchar" },
          { name: "firstName", type: "varchar", isNullable: true },
          { name: "lastName", type: "varchar", isNullable: true },
          {
            name: "role",
            type: "enum",
            enum: Object.values(UserRole) as string[],
            enumName: "UserRole",
            default: `'${UserRole.USER}'`,
          },
          {
            name: "deletedAt",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const user = queryRunner.connection.getMetadata(User);
    const table = await queryRunner.getTable(user.tableName);
    if (table) await queryRunner.dropTable(table);
  }
}
