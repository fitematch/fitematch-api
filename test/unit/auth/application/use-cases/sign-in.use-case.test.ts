import { UnauthorizedException } from '@nestjs/common';
import type { SessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/session.repository.interface';
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
  let sessionRepository: jest.Mocked<SessionRepositoryInterface>;
  let hashService: jest.Mocked<HashServiceInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;

  beforeEach(() => {
    signInRepository = {
      findByEmail: jest.fn(),
    } as jest.Mocked<SignInRepositoryInterface>;
    sessionRepository = {
      create: jest.fn(),
      findValidByUserId: jest.fn(),
      findValidByHash: jest.fn(),
      revokeById: jest.fn(),
      revokeAllByUserId: jest.fn(),
    } as jest.Mocked<SessionRepositoryInterface>;
    hashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<HashServiceInterface>;
    tokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      getRefreshTokenExpiresAt: jest.fn(),
    } as jest.Mocked<TokenServiceInterface>;

    useCase = new SignInUseCase(
      signInRepository,
      sessionRepository,
      hashService,
      tokenService,
    );
  });

  describe('execute', () => {
    describe('when the credentials are valid', () => {
      it('should return an access token and the signed user data', async () => {
        const input = {
          email: 'rebecca@fitematch.com',
          password: 'plain-password',
          userAgent: 'jest',
          ipAddress: '127.0.0.1',
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
        tokenService.generateRefreshToken.mockResolvedValue('refresh-token');
        hashService.hash.mockResolvedValue('hashed-refresh-token');
        tokenService.getRefreshTokenExpiresAt.mockReturnValue(
          new Date('2026-04-29T12:00:00.000Z'),
        );
        sessionRepository.create.mockResolvedValue({
          id: 'session-1',
          userId: user.id,
          refreshTokenHash: 'hashed-refresh-token',
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
          expiresAt: new Date('2026-04-29T12:00:00.000Z'),
          revokedAt: undefined,
          createdAt: new Date('2026-04-22T12:00:00.000Z'),
          updatedAt: new Date('2026-04-22T12:00:00.000Z'),
        });

        const result = await useCase.execute(input);

        const expectedPayload: AccessTokenPayload = {
          sub: user.id,
          id: user.id,
          email: user.email,
          productRole: user.productRole,
          adminRole: user.adminRole,
          recruiterProfile: undefined,
          permissions: user.permissions,
        };

        expect(result).toEqual({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
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
        expect(tokenService.generateRefreshToken).toHaveBeenCalledWith({
          sub: user.id,
          email: user.email,
        });
        expect(hashService.hash).toHaveBeenCalledWith('refresh-token');
        expect(sessionRepository.create).toHaveBeenCalledWith({
          userId: user.id,
          refreshTokenHash: 'hashed-refresh-token',
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
          expiresAt: new Date('2026-04-29T12:00:00.000Z'),
        });
      });
    });

    describe('when the user does not exist', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          email: 'missing@fitematch.com',
          password: 'plain-password',
          userAgent: 'jest',
          ipAddress: '127.0.0.1',
        };

        signInRepository.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(
          new UnauthorizedException('Invalid credentials.'),
        );
        expect(signInRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
        expect(sessionRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when the password is invalid', () => {
      it('should throw an unauthorized exception', async () => {
        const input = {
          email: 'rebecca@fitematch.com',
          password: 'wrong-password',
          userAgent: 'jest',
          ipAddress: '127.0.0.1',
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
        expect(sessionRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('when the token service throws an error', () => {
      it('should propagate the error', async () => {
        const input = {
          email: 'rebecca@fitematch.com',
          password: 'plain-password',
          userAgent: 'jest',
          ipAddress: '127.0.0.1',
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
          id: user.id,
          email: user.email,
          productRole: user.productRole,
          adminRole: undefined,
          recruiterProfile: undefined,
          permissions: undefined,
        });
        expect(sessionRepository.create).not.toHaveBeenCalled();
      });
    });
  });
});
