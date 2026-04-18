import type { CreateUserInputDto } from '@src/modules/user/application/dto/input/create-user.input.dto';
import type { CreateUserRequestDto } from '@src/modules/user/adapters/http/dto/request/create-user.request.dto';

export class CreateUserRequestMapper {
  static toInput(body: CreateUserRequestDto): CreateUserInputDto {
    return {
      name: body.name,
      email: body.email,
      password: body.password,
      birthday: body.birthday,
      candidateProfile: body.candidateProfile
        ? ({
            ...body.candidateProfile,
            documents: body.candidateProfile.documents
              ? {
                  ...body.candidateProfile.documents,
                  passport: body.candidateProfile.documents.passport
                    ? {
                        ...body.candidateProfile.documents.passport,
                        expirationDate: new Date(
                          body.candidateProfile.documents.passport
                            .expirationDate!,
                        ),
                      }
                    : undefined,
                }
              : undefined,
          } as CreateUserInputDto['candidateProfile'])
        : undefined,
      recruiterProfile: body.recruiterProfile,
      productRole: body.productRole,
      adminRole: body.adminRole,
      status: body.status,
    };
  }
}
