import * as bcrypt from 'bcrypt';
import { PasswordHashService } from '@src/modules/auth/infrastructure/services/password-hash.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordHashService', () => {
  let service: PasswordHashService;
  let hashMock: jest.MockedFunction<typeof bcrypt.hash>;
  let compareMock: jest.MockedFunction<typeof bcrypt.compare>;

  beforeEach(() => {
    service = new PasswordHashService();
    hashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
    compareMock = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;
    hashMock.mockReset();
    compareMock.mockReset();
  });

  describe('hash', () => {
    it('should hash the informed value with 10 salt rounds', async () => {
      hashMock.mockResolvedValue('hashed-value' as never);

      const result = await service.hash('plain-value');

      expect(result).toBe('hashed-value');
      expect(hashMock).toHaveBeenCalledWith('plain-value', 10);
    });
  });

  describe('compare', () => {
    it('should return true when the hash matches the informed value', async () => {
      compareMock.mockResolvedValue(true as never);

      const result = await service.compare('plain-value', 'hashed-value');

      expect(result).toBe(true);
      expect(compareMock).toHaveBeenCalledWith('plain-value', 'hashed-value');
    });

    it('should return false when the hash does not match the informed value', async () => {
      compareMock.mockResolvedValue(false as never);

      const result = await service.compare('plain-value', 'hashed-value');

      expect(result).toBe(false);
      expect(compareMock).toHaveBeenCalledWith('plain-value', 'hashed-value');
    });
  });
});
