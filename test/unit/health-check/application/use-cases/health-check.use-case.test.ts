import { HealthCheckUseCase } from '@src/modules/health-check/application/use-cases/health-check.use-case';

describe('HealthCheckUseCase', () => {
  let useCase: HealthCheckUseCase;
  const originalVersion = process.env.npm_package_version;

  beforeEach(() => {
    useCase = new HealthCheckUseCase();
  });

  afterEach(() => {
    if (originalVersion === undefined) {
      delete process.env.npm_package_version;
      return;
    }

    process.env.npm_package_version = originalVersion;
  });

  describe('execute', () => {
    it('should return the app health using the package version from environment', () => {
      process.env.npm_package_version = '1.2.3';

      const result = useCase.execute();

      expect(result).toEqual({
        healthy: true,
        name: 'API',
        version: '1.2.3',
      });
    });

    it('should fallback to the default version when package version is not defined', () => {
      delete process.env.npm_package_version;

      const result = useCase.execute();

      expect(result).toEqual({
        healthy: true,
        name: 'API',
        version: '0.0.1',
      });
    });
  });
});
