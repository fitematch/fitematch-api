export interface CreateActivationCodeUserData {
  id: string;
  email: string;
  status?: string;
}

export interface CreateActivationCodeRepositoryInterface {
  findByEmail(email: string): Promise<CreateActivationCodeUserData | null>;
}
