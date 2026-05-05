import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { DeleteMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/delete-my-job.repository.interface';
import { DeleteMyJobUseCase } from '@src/modules/job/application/use-cases/delete-my-job.use-case';

describe('DeleteMyJobUseCase', () => {
  let useCase: DeleteMyJobUseCase;
  let repository: jest.Mocked<DeleteMyJobRepositoryInterface>;

  const input = {
    userId: 'user-1',
    _id: 'job-1',
  };

  beforeEach(() => {
    repository = {
      findRecruiterCompanyId: jest.fn().mockResolvedValue('company-1'),
      delete: jest.fn(),
    } as jest.Mocked<DeleteMyJobRepositoryInterface>;

    useCase = new DeleteMyJobUseCase(repository);
  });

  it('deletes the recruiter job using the linked company id', async () => {
    repository.delete.mockResolvedValue(true);

    const result = await useCase.execute(input);

    expect(result).toBe(true);
    expect(repository.findRecruiterCompanyId).toHaveBeenCalledWith('user-1');
    expect(repository.delete).toHaveBeenCalledWith({
      ...input,
      companyId: 'company-1',
    });
  });

  it('throws when recruiter has no linked company', async () => {
    repository.findRecruiterCompanyId.mockResolvedValueOnce(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      new BadRequestException(
        'Recruiter does not have a company linked to profile.',
      ),
    );

    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('throws when the job is not found during delete', async () => {
    repository.delete.mockResolvedValueOnce(false);

    await expect(useCase.execute(input)).rejects.toThrow(
      new NotFoundException('Job not found.'),
    );

    expect(repository.delete).toHaveBeenCalledWith({
      ...input,
      companyId: 'company-1',
    });
  });

  it('propagates repository errors', async () => {
    repository.delete.mockRejectedValueOnce(new Error('Repository error'));

    await expect(useCase.execute(input)).rejects.toThrow('Repository error');
    expect(repository.delete).toHaveBeenCalledWith({
      ...input,
      companyId: 'company-1',
    });
  });
});
