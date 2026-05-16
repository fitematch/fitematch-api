export interface DatabaseLockManagerInterface {
  executeWithLock<T>(key: string, callback: () => Promise<T>): Promise<T>;
}
