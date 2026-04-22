export interface ActivateAccountUserData {
  id: string;
  email: string;
  status?: string;
}

export interface ActivateAccountRepositoryInterface {
  findByEmail(email: string): Promise<ActivateAccountUserData | null>;
  activateUser(userId: string): Promise<void>;
}
