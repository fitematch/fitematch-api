export class UpdateEmailTemplateInputDto {
  slug!: string;
  name!: string;
  description?: string | null;
  subject!: string;
  preheader?: string | null;
  body!: string;
  isActive!: boolean;
  category?: string | null;
}
