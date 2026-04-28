export interface ListPublicCompaniesOutput {
  id: string;
  slug: string;
  tradeName: string;
  media?: {
    logoUrl?: string;
  };
}
