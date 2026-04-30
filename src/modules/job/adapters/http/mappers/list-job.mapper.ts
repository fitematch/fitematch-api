import { ListJobOutputDto } from '@src/modules/job/application/dto/output/list-job.output.dto';
import { ListJobResponseDto } from '@src/modules/job/adapters/http/dto/response/list-job.response.dto';
import CurrencyUtils from '@src/shared/utils/currency.utils';

export class ListJobMapper {
  static toResponse(job: ListJobOutputDto): ListJobResponseDto {
    const currencyUtils = new CurrencyUtils();

    return {
      _id: job._id,
      slug: job.slug,
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      slots: job.slots,
      requirements: job.requirements,
      benefits: job.benefits
        ? {
            ...job.benefits,
            salary:
              job.benefits.salary !== undefined
                ? currencyUtils.formatBRL(job.benefits.salary)
                : undefined,
          }
        : undefined,
      media: job.media,
      company: job.company
        ? {
            id: job.company.id,
            tradeName: job.company.tradeName,
            contacts: job.company.contacts
              ? {
                  email: job.company.contacts.email,
                  website: job.company.contacts.website,
                  address: job.company.contacts.address
                    ? {
                        street: job.company.contacts.address.street,
                        number: job.company.contacts.address.number,
                        complement: job.company.contacts.address.complement,
                        neighborhood: job.company.contacts.address.neighborhood,
                        city: job.company.contacts.address.city,
                        state: job.company.contacts.address.state,
                        country: job.company.contacts.address.country,
                        zipCode: job.company.contacts.address.zipCode,
                      }
                    : undefined,
                }
              : undefined,
            media: job.company.media,
          }
        : undefined,
      contractType: job.contractType,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
