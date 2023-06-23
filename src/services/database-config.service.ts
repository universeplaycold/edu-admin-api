import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { Student } from '../students/entities/students.entity';
import { Teacher } from '../teachers/entites/teachers.entity';
import { StudentTeacher } from '../students/entities/student-teacher.entity';
import { ConnectionOptions, Connection } from 'typeorm';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  private secretsManager: SecretsManagerClient;
  private secretName: string;

  constructor() {
    this.secretsManager = new SecretsManagerClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.secretName = process.env.AWS_SECRET_NAME;
  }

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    let secretString: string;

    try {
      const response = await this.secretsManager.send(
        new GetSecretValueCommand({
          SecretId: this.secretName,
          VersionStage: 'AWSCURRENT',
        })
      );
      secretString = response.SecretString!;
    } catch (error) {
      console.error('Failed to retrieve database configuration from AWS Secrets Manager:', error);
      throw new Error('Unable to retrieve database configuration from AWS Secrets Manager.');
    }

    const secret: {
      username: string;
      password: string;
    } = JSON.parse(secretString);

    const options: ConnectionOptions = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: secret.username,
      password: secret.password,
      database: process.env.DB_DATABASE,
      entities: [StudentTeacher,Student, Teacher],
      synchronize: false,
    };

    await this.checkConnection(options);

    return options;
  }

  async checkConnection(options: ConnectionOptions): Promise<void> {
    const logger = new Logger('Database');

    const connection = new Connection(options);

    try {
      await connection.connect();
      logger.log('[Initialize] Connected to the database.');
    } catch (error) {
      logger.error(`Failed to connect to the database: ${error}`);
      throw new Error('Failed to connect to the database.');
    } finally {
      await connection.close();
    }
  }
}