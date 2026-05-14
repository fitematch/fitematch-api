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
                _id: { toString: () => 'template-1' },
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
    expect(result[0]?.id).toBe('template-1');
  });

  it('should read a template by id', async () => {
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            _id: { toString: () => 'template-1' },
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
          }),
        }),
      }),
    };

    const repository = new ReadEmailTemplateRepository(model as never);

    await repository.ensureDefaults();
    const result = await repository.read({ id: 'template-1' });

    expect(model.findById).toHaveBeenCalledWith('template-1');
    expect(result?.id).toBe('template-1');
  });

  it('should update a template by id', async () => {
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            _id: { toString: () => 'template-1' },
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
          }),
        }),
      }),
    };

    const repository = new UpdateEmailTemplateRepository(model as never);

    const result = await repository.update({
      id: 'template-1',
      subject: 'Updated subject',
      preheader: 'Updated preheader',
      body: '<p>Updated body</p>',
    });

    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      'template-1',
      {
        $set: {
          subject: 'Updated subject',
          preheader: 'Updated preheader',
          body: '<p>Updated body</p>',
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
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: { toString: () => 'template-1' },
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
          save,
        }),
      }),
    };

    const repository = new ResetEmailTemplateRepository(model as never);

    const result = await repository.reset({ id: 'template-1' });

    expect(save).toHaveBeenCalledTimes(1);
    expect(result?.subject).toBe('Default subject');
    expect(result?.preheader).toBe('Default preheader');
    expect(result?.body).toBe('<p>Default body</p>');
  });

  it('should read a template for test sending', async () => {
    const model = {
      bulkWrite: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({
            _id: { toString: () => 'template-1' },
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
          }),
        }),
      }),
    };

    const repository = new TestEmailTemplateRepository(model as never);

    const result = await repository.read({ id: 'template-1' });

    expect(result?.slug).toBe('activation-code');
  });
});
