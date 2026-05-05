export interface CreateActivationCodeUserData {
  id: string;
  name: string;
  email: string;
  status?: string;
}

export interface CreateActivationCodeRepositoryInterface {
  findByEmail(email: string): Promise<CreateActivationCodeUserData | null>;
}
