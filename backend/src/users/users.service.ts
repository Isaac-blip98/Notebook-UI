import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import { User } from './interface/user.interface';

@Injectable()
export class UsersService {
  private pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM create_user($1, $2, $3)',
        [name, email, password],
      );
      return result.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        error.detail || 'User creation failed',
      );
    }
  }

  

  async findByEmail(
    email: string,
  ): Promise<(User & { password: string }) | null> {
    const result = await this.pool.query(
      'SELECT * FROM get_user_by_email($1)',
      [email],
    );
    return result.rows[0] || null;
  }
}
