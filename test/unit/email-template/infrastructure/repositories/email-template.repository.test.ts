jest.mock(
  '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema',
  () => ({
    EmailTemplateSchema: class EmailTemplateSchema {},
  }),
);

import { ListEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/list-email-template.repository';
import { ReadEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/read-email-template.repository';
import { UpdateEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/update-email-template.repository';
import { ResetEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/reset-email-template.repository';
import { TestEmailTemplateRepository } from '@src/modules/email-template/infrastructure/repositories/test-email-template.repository';

describe('EmailTemplateRepositories', () => {
  it('should list templates after ensuring defaults', async () => {
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                slug: 'activation-code',
                name: 'Activation Code',
                description: 'Activation email',
                subject: 'Subject',
                preheader: 'Preheader',
                body: '<p>Body</p>',
                defaultSubject: 'Subject',
                defaultPreheader: 'Preheader',
                defaultBody: '<p>Body</p>',
                variables: [],
                isSystem: true,
                isActive: true,
                category: 'auth',
                version: 1,
              },
            ]),
          }),
        }),
      }),
    };

    const repository = new ListEmailTemplateRepository(model as never);

    await repository.ensureDefaults();
    const result = await repository.list();

    expect(model.bulkWrite).toHaveBeenCalledTimes(1);
    expect(result[0]?.slug).toBe('activation-code');
  });

  it('should read a template by slug', async () => {
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            slug: 'activation-code',
            name: 'Activation Code',
            description: 'Activation email',
            subject: 'Subject',
            preheader: 'Preheader',
            body: '<p>Body</p>',
            defaultSubject: 'Subject',
            defaultPreheader: 'Preheader',
            defaultBody: '<p>Body</p>',
            variables: [],
            isSystem: true,
            isActive: true,
            category: 'auth',
            version: 1,
          }),
        }),
      }),
    };

    const repository = new ReadEmailTemplateRepository(model as never);

    await repository.ensureDefaults();
    const result = await repository.read({ slug: 'Activation-Code' });

    expect(model.findOne).toHaveBeenCalledWith({ slug: 'activation-code' });
    expect(result?.slug).toBe('activation-code');
  });

  it('should update a template by slug', async () => {
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      findOneAndUpdate: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            slug: 'activation-code',
            name: 'Activation Code',
            description: 'Activation email',
            subject: 'Updated subject',
            preheader: 'Updated preheader',
            body: '<p>Updated body</p>',
            defaultSubject: 'Subject',
            defaultPreheader: 'Preheader',
            defaultBody: '<p>Body</p>',
            variables: [],
            isSystem: true,
            isActive: true,
            category: 'auth',
            version: 1,
          }),
        }),
      }),
    };

    const repository = new UpdateEmailTemplateRepository(model as never);

    const result = await repository.update({
      slug: 'Activation-Code',
      name: 'Activation Code',
      description: 'Activation email',
      subject: 'Updated subject',
      preheader: 'Updated preheader',
      body: '<p>Updated body</p>',
      isActive: true,
      category: 'auth',
    });

    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { slug: 'activation-code' },
      {
        $set: {
          name: 'Activation Code',
          description: 'Activation email',
          subject: 'Updated subject',
          preheader: 'Updated preheader',
          body: '<p>Updated body</p>',
          isActive: true,
          category: 'auth',
        },
      },
      { new: true },
    );
    expect(result?.subject).toBe('Updated subject');
  });

  it('should reset a template to its default content', async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          slug: 'activation-code',
          name: 'Activation Code',
          description: 'Activation email',
          subject: 'Custom subject',
          preheader: 'Custom preheader',
          body: '<p>Custom body</p>',
          defaultSubject: 'Default subject',
          defaultPreheader: 'Default preheader',
          defaultBody: '<p>Default body</p>',
          variables: [],
          isSystem: true,
          isActive: true,
          category: 'auth',
          version: 1,
          save,
        }),
      }),
    };

    const repository = new ResetEmailTemplateRepository(model as never);

    const result = await repository.reset({ slug: 'activation-code' });

    expect(save).toHaveBeenCalledTimes(1);
    expect(result?.subject).toBe('Default subject');
    expect(result?.preheader).toBe('Default preheader');
    expect(result?.body).toBe('<p>Default body</p>');
  });

  it('should read a template for test sending', async () => {
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            slug: 'activation-code',
            name: 'Activation Code',
            description: 'Activation email',
            subject: 'Subject',
            preheader: 'Preheader',
            body: '<p>Body</p>',
            defaultSubject: 'Subject',
            defaultPreheader: 'Preheader',
            defaultBody: '<p>Body</p>',
            variables: [],
            isSystem: true,
            isActive: true,
            category: 'auth',
            version: 1,
          }),
        }),
      }),
    };

    const repository = new TestEmailTemplateRepository(model as never);

    const result = await repository.read({ slug: 'activation-code' });

    expect(result?.slug).toBe('activation-code');
  });
});
