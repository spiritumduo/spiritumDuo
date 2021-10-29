import { ApolloClient } from '@apollo/client';
import User from 'types/Users';

interface LoginResult {pathwayOptions: string[], user: User}

export interface LoginModel {
  doLogin(username: string, password: string): Promise<LoginResult | null>;
}

class LoginModelImpl {
  client: ApolloClient<unknown>;

  constructor(client: ApolloClient<unknown>) {
    this.client = client;
  }

  static async doLogin(
    username: string,
    password: string,
  ): Promise<LoginResult | null> {
    if (username === 'invalid') return null;
    return {
      pathwayOptions: ['Lung Cancer', 'Broncheastasis'],
      user: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        department: 'Respiratory',
        roles: [{ id: 1, name: 'Doctor' }],
      } as User,
    };
  }
}

export default LoginModelImpl;
