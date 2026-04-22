import { UnauthorizedException } from '@nestjs/common';
import type { SignInRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/sign-in.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type {
  AccessTokenPayload,
  TokenServiceInterface,
} from '@src/modules/auth/application/contracts/services/token.service.interface';
import { SignInUseCase } from '@src/modules/auth/application/use-cases/sign-in.use-case';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let signInRepository: jest.Mocked<SignInRepositoryInterface>;
  let hashService: jest.Mocked<HashServiceInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;

  beforeEach(() => {
    signInRepository = {
      findByEmail: jest.fn(),
    } as jest.Mocked<SignInRepositoryInterface>;
    hashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<HashServiceInterface>;
    tokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as jest.Mocked<TokenServiceInterface>;

    useCase = new SignInUseCase(signInRepository, hashService, tokenService);
  });

  describe('execute', () => {
    describe('when the credentials are valid', () => {
      it('should return an access token and the signed user data', async () => {
        const input = {
          email: 'rebecca@fitematch.com',
          password: 'plain-password',
        };
        const user = {
          id: 'user-1',
          name: 'Rebecca Chambers',
          email: input.email,
          password: 'hashed-password',
          productRole: ProductRoleEnum.RECRUITER,
          adminRole: AdminRoleEnum.SUPER_ADMIN,
          permissions: [
            PermissionEnum.CREATE_USERS,
            PermissionEnum.CREATE_JOBS,
          ],
          status: UserStatusEnum.ACTIVE,
        };

        signInRepository.findByEmail.mockResolvedValue(user);
        hashService.compare.mockResolvedValue(true);
        tokenService.generateAccessToken.mockResolvedValue('access-token');

        const result = await useCase.execute(input);

        const expectedPayload: AccessTokenPayload = {
          sub: user.id,
          email: user.email,
          productRole: user.productRole,
          adminRole: user.adminRole,
          permissions: user.permissions,
        };

        expect(result).toEqual({
          accessToken: 'access-token',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            productRole: user.productRole,
            adminRole: user.adminRole,
            permissions: user.permissions,
            status: user.status,
          },
        });
        expect(signInRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(hashService.compare).toHaveBeenCalledWith(
          input.password,
          user.password,
        );
        expect(tokenService.generateAccessToken).toHaveBeenCalledWith(
          expectedPayload,
        );
      });
    });

    describe('when the user does not exist', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          email: 'missing@fitematch.com',
          password: 'plain-password',
        };

        signInRepository.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid credentials.'),
        );
        expect(signInRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
      });
    });

    describe('when the password is invalid', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          email: 'rebecca@fitematch.com',
          password: 'wrong-password',
        };
        const user = {
          id: 'user-1',
          name: 'Rebecca Chambers',
          email: input.email,
          password: 'hashed-password',
          productRole: ProductRoleEnum.CANDIDATE,
          status: UserStatusEnum.ACTIVE,
        };

        signInRepository.findByEmail.mockResolvedValue(user);
        hashService.compare.mockResolvedValue(false);

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid credentials.'),
        );
        expect(hashService.compare).toHaveBeenCalledWith(
          input.password,
          user.password,
        );
        expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
      });
    });

    describe('when the token service throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          email: 'rebecca@fitematch.com',
          password: 'plain-password',
        };
        const user = {
          id: 'user-1',
          name: 'Rebecca Chambers',
          email: input.email,
          password: 'hashed-password',
          productRole: ProductRoleEnum.RECRUITER,
          status: UserStatusEnum.ACTIVE,
        };

        signInRepository.findByEmail.mockResolvedValue(user);
        hashService.compare.mockResolvedValue(true);
        tokenService.generateAccessToken.mockRejectedValue(
          new Error('Token service error'),
        );

        await expect(useCase.execute(input)).rejects.toThrow(
          'Token service error',
        );
        expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
          sub: user.id,
          email: user.email,
          productRole: user.productRole,
          adminRole: undefined,
          permissions: undefined,
        });
      });
    });
  });
});
