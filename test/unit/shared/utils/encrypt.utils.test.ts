import * as bcrypt from 'bcrypt';
import EncryptUtils from '@src/shared/utils/encrypt.utils';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('EncryptUtils', () => {
  let encryptUtils: EncryptUtils;

  beforeEach(() => {
    encryptUtils = new EncryptUtils();
    jest.clearAllMocks();
  });

  it('should encrypt a password using bcrypt', async () => {
    const hashSpy = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
    hashSpy.mockResolvedValue('hashed-value' as never);

    await expect(encryptUtils.encryptPassword('secret')).resolves.toBe(
      'hashed-value',
    );
    expect(hashSpy).toHaveBeenCalledWith('secret', 10);
  });

  it('should compare a password using bcrypt', async () => {
    const compareSpy = bcrypt.compare as jest.MockedFunction<
      typeof bcrypt.compare
    >;
    compareSpy.mockResolvedValue(true as never);

    await expect(
      encryptUtils.comparePassword('secret', 'hashed-value'),
    ).resolves.toBe(true);
    expect(compareSpy).toHaveBeenCalledWith('secret', 'hashed-value');
  });
});
