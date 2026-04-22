import { SignOutUseCase } from '@src/modules/auth/application/use-cases/sign-out.use-case';

describe('SignOutUseCase', () => {
  let useCase: SignOutUseCase;

  beforeEach(() => {
    useCase = new SignOutUseCase();
  });

  describe('execute', () => {
    it('should return a success message', async () => {
      const input = {
        refreshToken: 'refresh-token',
      };

      const result = await useCase.execute(input);

      expect(result).toEqual({
        message: 'Signed out successfully.',
      });
    });
  });
});
