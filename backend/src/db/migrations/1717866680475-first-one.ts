import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  EMAIL_FOR_TESTING,
  FULL_NAME_FOR_TESTING,
  PASSWORD_FOR_TESTING,
  USERNAME_FOR_TESTING,
} from '../../auth/utils/singInUser';
import * as bcrypt from 'bcrypt';

export class FirstOne1717866680475 implements MigrationInterface {
  name = 'FirstOne1717866680475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100), "email" character varying(100) NOT NULL, "password" character varying(150), "is_password_reset" boolean NOT NULL DEFAULT false, "signature" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "role" character varying(50) NOT NULL DEFAULT 'user', "preferred_language" character varying NOT NULL DEFAULT 'en', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "phone" character varying(100) NOT NULL DEFAULT '', "profile_image_key" character varying(255), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PASSWORD_FOR_TESTING, salt);
    await queryRunner.query(
      `INSERT INTO "users" ("username", "first_name", "last_name", "email", "password", "is_password_reset", "is_active", "role", "preferred_language", "phone") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        USERNAME_FOR_TESTING,
        FULL_NAME_FOR_TESTING,
        '',
        EMAIL_FOR_TESTING,
        hashedPassword,
        false,
        true,
        'user',
        'en',
        '',
      ],
    );

    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "title" character varying(255), "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "likes" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "post_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_USER_POST" UNIQUE ("user_id", "post_id"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "follows" ("id" SERIAL NOT NULL, "follower_id" integer NOT NULL, "following_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_FOLLOWER_FOLLOWING" UNIQUE ("follower_id", "following_id"), CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "seeders" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "executed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c47f92b5ea524850088945b62cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "FK_54b5dc2739f2dea57900933db66" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "FK_54b5dc2739f2dea57900933db66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`,
    );
    await queryRunner.query(`DROP TABLE "seeders"`);
    await queryRunner.query(`DROP TABLE "follows"`);
    await queryRunner.query(`DROP TABLE "likes"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
