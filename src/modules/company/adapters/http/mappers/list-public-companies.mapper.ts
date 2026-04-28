import { ListPublicCompaniesOutput } from '@src/modules/company/application/dto/output/list-public-companies.output';
import { ListPublicCompaniesResponseDto } from '@src/modules/company/adapters/http/dto/response/list-public-companies-response.dto';

export class ListPublicCompaniesMapper {
  static toResponse(
    output: ListPublicCompaniesOutput,
  ): ListPublicCompaniesResponseDto {
    return {
      id: output.id,
      slug: output.slug,
      tradeName: output.tradeName,
      media: output.media,
    };
  }

  static toResponseList(
    output: ListPublicCompaniesOutput[],
  ): ListPublicCompaniesResponseDto[] {
    return output.map((item) => this.toResponse(item));
  }
}
