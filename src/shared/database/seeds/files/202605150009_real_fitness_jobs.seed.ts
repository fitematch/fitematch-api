import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';
import { EducationLevelEnum } from '@src/shared/domain/enums/education-level.enum';
import { LanguagesEnum } from '@src/shared/domain/enums/languages.enum';
import { LanguagesLevelEnum } from '@src/shared/domain/enums/languages-levels.enum';
import { HardSkillsEnum } from '@src/shared/domain/enums/hard-skills.enum';
import { SoftSkillsEnum } from '@src/shared/domain/enums/soft-skills.enum';
import { SlugUtils } from '@src/shared/utils/slug.utils';

type CategoryKey =
  | 'fit-dance'
  | 'ioga'
  | 'jiu-jitsu'
  | 'judo'
  | 'muay-thai'
  | 'musculacao'
  | 'natacao'
  | 'personal-trainer'
  | 'pilates'
  | 'spinning'
  | 'zumba';

type CategoryDefinition = {
  key: CategoryKey;
  title: string;
  salary: number;
  slots: number[];
  educationLevel: EducationLevelEnum[];
  hardSkills: HardSkillsEnum[];
  niceToHaveHardSkills?: HardSkillsEnum[];
  softSkills: SoftSkillsEnum[];
  summary: string;
  responsibilities: string[];
  differential?: string;
  contractTypes: JobContractTypeEnum[];
};

type CompanyJobPlan = {
  companySlug: string;
  categories: CategoryKey[];
};

const CATEGORY_IMAGE_BASE = '/images/categories';

const categoryDefinitions: Record<CategoryKey, CategoryDefinition> = {
  'fit-dance': {
    key: 'fit-dance',
    title: 'Professor(a) de Fit Dance',
    salary: 2800,
    slots: [1, 2, 3],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.GROUP_CLASSES,
      HardSkillsEnum.FUNCTIONAL_TRAINING,
      HardSkillsEnum.FITNESS_SOFTWARE,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.HIIT],
    softSkills: [
      SoftSkillsEnum.COMMUNICATION,
      SoftSkillsEnum.MOTIVATION,
      SoftSkillsEnum.CUSTOMER_SERVICE,
    ],
    summary:
      'Conduzir aulas coletivas energéticas, com foco em retenção, experiência do aluno e progressão técnica segura.',
    responsibilities: [
      'Planejar playlists, coreografias e progressão semanal das turmas.',
      'Realizar correções posturais e adaptações para diferentes níveis.',
      'Apoiar ações internas de captação, aula experimental e eventos temáticos.',
    ],
    differential:
      'Experiência com turmas cheias, aulas temáticas e condução de eventos fitness.',
    contractTypes: [
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.PART_TIME,
      JobContractTypeEnum.FREELANCE,
    ],
  },
  ioga: {
    key: 'ioga',
    title: 'Professor(a) de Yoga',
    salary: 3200,
    slots: [1, 2],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.YOGA,
      HardSkillsEnum.MOBILITY_TRAINING,
      HardSkillsEnum.FLEXIBILITY_TRAINING,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.POSTURAL_CORRECTION],
    softSkills: [
      SoftSkillsEnum.EMPATHY,
      SoftSkillsEnum.ACTIVE_LISTENING,
      SoftSkillsEnum.PROFESSIONAL_ETHICS,
    ],
    summary:
      'Conduzir práticas de yoga com segurança, atenção à respiração, mobilidade e bem-estar físico e mental.',
    responsibilities: [
      'Estruturar aulas para iniciantes e praticantes intermediários.',
      'Orientar postura, respiração e execução respeitando limitações individuais.',
      'Apoiar programas de bem-estar e retenção de alunos na unidade.',
    ],
    differential:
      'Vivência com práticas restaurativas, alongamento e programas corporativos.',
    contractTypes: [
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.PART_TIME,
      JobContractTypeEnum.AUTONOMOUS,
    ],
  },
  'jiu-jitsu': {
    key: 'jiu-jitsu',
    title: 'Professor(a) de Jiu-Jitsu',
    salary: 3600,
    slots: [1, 2],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.SPORTS_CONDITIONING,
      HardSkillsEnum.GROUP_CLASSES,
      HardSkillsEnum.FIRST_AID,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.CPR],
    softSkills: [
      SoftSkillsEnum.LEADERSHIP,
      SoftSkillsEnum.DISCIPLINE,
      SoftSkillsEnum.RESILIENCE,
    ],
    summary:
      'Ministrar aulas de jiu-jitsu para turmas mistas, com metodologia progressiva, disciplina e prevenção de lesões.',
    responsibilities: [
      'Planejar conteúdos técnicos por faixa e nível de experiência.',
      'Conduzir aquecimento, técnica, drilling e rounds com segurança.',
      'Acompanhar evolução dos alunos e apoiar eventos internos e graduações.',
    ],
    differential:
      'Histórico em campeonatos, formação de base e gestão de turmas infantis.',
    contractTypes: [
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.FREELANCE,
      JobContractTypeEnum.PART_TIME,
    ],
  },
  judo: {
    key: 'judo',
    title: 'Professor(a) de Judô',
    salary: 3400,
    slots: [1, 2],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.SPORTS_CONDITIONING,
      HardSkillsEnum.GROUP_CLASSES,
      HardSkillsEnum.FIRST_AID,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.CPR],
    softSkills: [
      SoftSkillsEnum.LEADERSHIP,
      SoftSkillsEnum.PATIENCE,
      SoftSkillsEnum.PROFESSIONAL_ETHICS,
    ],
    summary:
      'Atuar na condução de aulas de judô com foco em base técnica, disciplina, formação esportiva e retenção.',
    responsibilities: [
      'Organizar turmas por nível técnico e faixa etária.',
      'Garantir segurança em quedas, projeções e progressão pedagógica.',
      'Apoiar campeonatos internos, avaliações e calendário esportivo da unidade.',
    ],
    differential:
      'Experiência com iniciação esportiva e desenvolvimento de turmas juvenis.',
    contractTypes: [
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.PART_TIME,
      JobContractTypeEnum.TEMPORARY,
    ],
  },
  'muay-thai': {
    key: 'muay-thai',
    title: 'Professor(a) de Muay Thai',
    salary: 3500,
    slots: [1, 2, 3],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.SPORTS_CONDITIONING,
      HardSkillsEnum.GROUP_CLASSES,
      HardSkillsEnum.FIRST_AID,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.CPR],
    softSkills: [
      SoftSkillsEnum.MOTIVATION,
      SoftSkillsEnum.COMMUNICATION,
      SoftSkillsEnum.DISCIPLINE,
    ],
    summary:
      'Conduzir aulas dinâmicas de muay thai com foco em técnica, condicionamento e experiência segura em turma.',
    responsibilities: [
      'Estruturar treinos técnicos, circuitos e progressão por nível.',
      'Orientar postura, guarda, deslocamento e execução de golpes.',
      'Apoiar eventos internos, aulas experimentais e retenção de alunos.',
    ],
    differential:
      'Vivência com cardio fight, turmas iniciantes e performance em aulas coletivas.',
    contractTypes: [
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.PART_TIME,
      JobContractTypeEnum.FREELANCE,
    ],
  },
  musculacao: {
    key: 'musculacao',
    title: 'Instrutor(a) de Musculação',
    salary: 3100,
    slots: [2, 3, 4],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.EXERCISE_PRESCRIPTION,
      HardSkillsEnum.STRENGTH_TRAINING,
      HardSkillsEnum.EQUIPMENT_INSTRUCTION,
      HardSkillsEnum.WORKOUT_PLAN_DESIGN,
    ],
    niceToHaveHardSkills: [
      HardSkillsEnum.BODY_COMPOSITION_ASSESSMENT,
      HardSkillsEnum.ANTHROPOMETRIC_EVALUATION,
    ],
    softSkills: [
      SoftSkillsEnum.CUSTOMER_SERVICE,
      SoftSkillsEnum.PROACTIVITY,
      SoftSkillsEnum.ATTENTION_TO_DETAIL,
    ],
    summary:
      'Atender alunos em sala de musculação, prescrever treinos, corrigir execução e garantir experiência de alto padrão.',
    responsibilities: [
      'Montar treinos conforme objetivo, nível e restrições de cada aluno.',
      'Acompanhar execução, orientar uso de equipamentos e prevenir lesões.',
      'Apoiar métricas de retenção, atendimento e organização do salão.',
    ],
    differential:
      'Experiência em academias de grande fluxo e treinamento periodizado.',
    contractTypes: [
      JobContractTypeEnum.CLT,
      JobContractTypeEnum.FULL_TIME,
      JobContractTypeEnum.PJ,
    ],
  },
  natacao: {
    key: 'natacao',
    title: 'Professor(a) de Natação',
    salary: 3700,
    slots: [1, 2, 3],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.SPORTS_CONDITIONING,
      HardSkillsEnum.FIRST_AID,
      HardSkillsEnum.CPR,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.FUNCTIONAL_ASSESSMENT],
    softSkills: [
      SoftSkillsEnum.PATIENCE,
      SoftSkillsEnum.COMMUNICATION,
      SoftSkillsEnum.RESPONSIBILITY,
    ],
    summary:
      'Conduzir aulas de natação para diferentes faixas etárias, com foco em técnica, segurança aquática e evolução do aluno.',
    responsibilities: [
      'Separar turmas por nível e acompanhar progresso técnico individual.',
      'Aplicar protocolos de segurança, adaptação ao meio líquido e primeiros socorros.',
      'Apoiar avaliação de alunos, rematrícula e relacionamento com responsáveis.',
    ],
    differential:
      'Experiência com escolas de natação, iniciação infantil e adultos iniciantes.',
    contractTypes: [
      JobContractTypeEnum.CLT,
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.PART_TIME,
    ],
  },
  'personal-trainer': {
    key: 'personal-trainer',
    title: 'Personal Trainer',
    salary: 4200,
    slots: [1, 2],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.PERSONAL_TRAINING,
      HardSkillsEnum.TRAINING_PERIODIZATION,
      HardSkillsEnum.WORKOUT_PLAN_DESIGN,
      HardSkillsEnum.FUNCTIONAL_ASSESSMENT,
    ],
    niceToHaveHardSkills: [
      HardSkillsEnum.BODY_COMPOSITION_ASSESSMENT,
      HardSkillsEnum.NUTRITION_BASICS,
    ],
    softSkills: [
      SoftSkillsEnum.EMPATHY,
      SoftSkillsEnum.TIME_MANAGEMENT,
      SoftSkillsEnum.MOTIVATION,
    ],
    summary:
      'Atuar com atendimento personalizado, foco em performance, fidelização e prescrição individual de treino.',
    responsibilities: [
      'Realizar avaliação inicial, montar plano de treino e acompanhar evolução.',
      'Gerenciar carteira de alunos, horários e indicadores de recorrência.',
      'Atuar em sinergia com recepção e time técnico na retenção e upsell de serviços.',
    ],
    differential:
      'Experiência com pós-reabilitação, emagrecimento e atendimento premium.',
    contractTypes: [
      JobContractTypeEnum.AUTONOMOUS,
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.FREELANCE,
    ],
  },
  pilates: {
    key: 'pilates',
    title: 'Instrutor(a) de Pilates',
    salary: 3300,
    slots: [1, 2],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.PILATES,
      HardSkillsEnum.POSTURAL_CORRECTION,
      HardSkillsEnum.MOBILITY_TRAINING,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.REHABILITATION_SUPPORT],
    softSkills: [
      SoftSkillsEnum.ATTENTION_TO_DETAIL,
      SoftSkillsEnum.EMPATHY,
      SoftSkillsEnum.ORGANIZATION,
    ],
    summary:
      'Atuar em estúdio ou aula coletiva com foco em controle motor, mobilidade, postura e atendimento próximo.',
    responsibilities: [
      'Montar progressões e adaptações conforme objetivo e limitação do aluno.',
      'Conduzir sessões seguras com atenção à técnica e alinhamento corporal.',
      'Acompanhar evolução, frequência e experiência do aluno na unidade.',
    ],
    differential:
      'Experiência com pilates solo, aparelhos e atendimento para públicos 40+.',
    contractTypes: [
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.PART_TIME,
      JobContractTypeEnum.AUTONOMOUS,
    ],
  },
  spinning: {
    key: 'spinning',
    title: 'Professor(a) de Spinning',
    salary: 3000,
    slots: [1, 2, 3],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.INDOOR_CYCLING,
      HardSkillsEnum.CARDIOVASCULAR_TRAINING,
      HardSkillsEnum.GROUP_CLASSES,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.HIIT],
    softSkills: [
      SoftSkillsEnum.MOTIVATION,
      SoftSkillsEnum.COMMUNICATION,
      SoftSkillsEnum.POSITIVE_ATTITUDE,
    ],
    summary:
      'Conduzir aulas de bike indoor com intensidade controlada, experiência imersiva e retenção de alunos.',
    responsibilities: [
      'Planejar perfis de aula, playlists e progressão de carga por turma.',
      'Monitorar cadência, técnica e segurança durante o treino.',
      'Apoiar campanhas de ocupação de horários de pico e aula experimental.',
    ],
    differential:
      'Vivência com aulas temáticas, bike performance e treinos intervalados.',
    contractTypes: [
      JobContractTypeEnum.PJ,
      JobContractTypeEnum.PART_TIME,
      JobContractTypeEnum.FREELANCE,
    ],
  },
  zumba: {
    key: 'zumba',
    title: 'Professor(a) de Zumba',
    salary: 2750,
    slots: [1, 2, 3],
    educationLevel: [EducationLevelEnum.BACHELOR],
    hardSkills: [
      HardSkillsEnum.GROUP_CLASSES,
      HardSkillsEnum.CARDIOVASCULAR_TRAINING,
      HardSkillsEnum.FITNESS_SOFTWARE,
    ],
    niceToHaveHardSkills: [HardSkillsEnum.FUNCTIONAL_TRAINING],
    softSkills: [
      SoftSkillsEnum.MOTIVATION,
      SoftSkillsEnum.CUSTOMER_SERVICE,
      SoftSkillsEnum.POSITIVE_ATTITUDE,
    ],
    summary:
      'Liderar aulas de zumba com alta energia, inclusão de diferentes perfis de aluno e foco em experiência.',
    responsibilities: [
      'Conduzir turmas com coreografias acessíveis e progressão por nível.',
      'Apoiar campanhas de retenção, eventos temáticos e aulas abertas.',
      'Monitorar segurança, engajamento e frequência das turmas.',
    ],
    differential:
      'Experiência com coreografias latinas, eventos sazonais e captação de novos alunos.',
    contractTypes: [
      JobContractTypeEnum.FREELANCE,
      JobContractTypeEnum.PART_TIME,
      JobContractTypeEnum.PJ,
    ],
  },
};

const companyPlans: CompanyJobPlan[] = [
  {
    companySlug: 'caicara-fit',
    categories: ['musculacao', 'spinning', 'fit-dance', 'personal-trainer'],
  },
  {
    companySlug: 'inspire',
    categories: ['pilates', 'ioga', 'zumba', 'personal-trainer'],
  },
  {
    companySlug: 'iron-force',
    categories: ['musculacao', 'muay-thai', 'jiu-jitsu', 'personal-trainer'],
  },
  {
    companySlug: 'nexo',
    categories: ['musculacao', 'spinning', 'pilates', 'ioga'],
  },
  {
    companySlug: 'ocian',
    categories: ['musculacao', 'fit-dance', 'zumba', 'spinning'],
  },
  {
    companySlug: 'serenity',
    categories: ['pilates', 'ioga', 'personal-trainer', 'fit-dance'],
  },
  {
    companySlug: 'arena',
    categories: ['judo', 'jiu-jitsu', 'muay-thai'],
  },
];

const buildDescription = (
  companyTradeName: string,
  city: string,
  category: CategoryDefinition,
): string => {
  const summary = `${category.title} para ${companyTradeName} em ${city}, com foco em aulas seguras, retenção de alunos e rotina operacional.`;

  return summary.length <= 140
    ? summary
    : `${category.title} para ${companyTradeName} em ${city}, com foco em aulas seguras e experiência do aluno.`;
};

const buildJobDocument = (
  company: {
    _id: { toString(): string };
    slug: string;
    tradeName: string;
    contacts?: {
      address?: {
        city?: string;
        state?: string;
      };
    };
  },
  categoryKey: CategoryKey,
  index: number,
) => {
  const category = categoryDefinitions[categoryKey];
  const title = category.title;
  const city = company.contacts?.address?.city ?? 'sua cidade';
  const state = company.contacts?.address?.state ?? 'SP';
  const slug = SlugUtils.generate(`${company.slug}-${title}`);

  return {
    slug,
    companyId: company._id.toString(),
    title,
    normalizedTitle: SlugUtils.generate(title),
    description: buildDescription(company.tradeName, city, category),
    slots: category.slots[index % category.slots.length],
    requirements: {
      educationLevel: category.educationLevel,
      minExperienceYears: 1 + (index % 3),
      maxExperienceYears: 3 + (index % 4),
      languages: [
        {
          name: LanguagesEnum.PORTUGUESE,
          level: LanguagesLevelEnum.NATIVE,
        },
        {
          name: LanguagesEnum.ENGLISH,
          level:
            categoryKey === 'personal-trainer' || categoryKey === 'ioga'
              ? LanguagesLevelEnum.BASIC
              : LanguagesLevelEnum.INTERMEDIATE,
        },
      ],
      hardSkills: {
        required: category.hardSkills,
        niceToHave: category.niceToHaveHardSkills,
      },
      softSkills: {
        required: category.softSkills,
        niceToHave: [
          SoftSkillsEnum.TEAMWORK,
          SoftSkillsEnum.PROACTIVITY,
          SoftSkillsEnum.RESPONSIBILITY,
        ],
      },
    },
    benefits: {
      salary: category.salary + index * 150,
      healthInsurance:
        categoryKey === 'musculacao' ||
        categoryKey === 'natacao' ||
        categoryKey === 'personal-trainer',
      dentalInsurance: index % 2 === 0,
      alimentationVoucher: true,
      transportationVoucher: state === 'SP' || state === 'RJ' || state === 'PA',
    },
    media: {
      coverUrl: `${CATEGORY_IMAGE_BASE}/${categoryKey}.png`,
    },
    contractType: category.contractTypes[index % category.contractTypes.length],
    status: JobStatusEnum.ACTIVE,
  };
};

const seed: SeedInterface = {
  name: '202605150009_real_fitness_jobs.seed.ts',

  async run({ connection, logger, session }) {
    const companyModel = connection.model<CompanyDocument>(CompanySchema.name);
    const jobModel = connection.model<JobDocument>(JobSchema.name);

    const companies = await companyModel
      .find(
        {
          slug: {
            $in: companyPlans.map((plan) => plan.companySlug),
          },
        },
        {
          _id: 1,
          slug: 1,
          tradeName: 1,
          'contacts.address.city': 1,
          'contacts.address.state': 1,
        },
      )
      .session(session ?? null)
      .lean()
      .exec();

    const companiesBySlug = new Map(
      companies.map((company) => [company.slug, company]),
    );

    const missingCompanies = companyPlans
      .map((plan) => plan.companySlug)
      .filter((companySlug) => !companiesBySlug.has(companySlug));

    if (missingCompanies.length > 0) {
      throw new Error(
        `Cannot seed jobs because companies are missing: ${missingCompanies.join(', ')}`,
      );
    }

    const jobs = companyPlans.flatMap((plan) => {
      const company = companiesBySlug.get(plan.companySlug);

      if (!company) {
        return [];
      }

      return plan.categories.map((categoryKey, index) =>
        buildJobDocument(company, categoryKey, index),
      );
    });

    await Promise.all(
      jobs.map((job) =>
        jobModel.updateOne(
          { slug: job.slug },
          {
            $set: {
              companyId: job.companyId,
              title: job.title,
              normalizedTitle: job.normalizedTitle,
              description: job.description,
              slots: job.slots,
              requirements: job.requirements,
              benefits: job.benefits,
              media: job.media,
              contractType: job.contractType,
              status: job.status,
            },
            $setOnInsert: {
              slug: job.slug,
            },
          },
          {
            upsert: true,
            session,
          },
        ),
      ),
    );

    logger.log(`Real fitness jobs seed ensured ${jobs.length} active jobs.`);
  },

  async rollback({ connection, logger, session }) {
    const jobModel = connection.model<JobDocument>(JobSchema.name);

    const slugs = companyPlans.flatMap((plan) =>
      plan.categories.map((categoryKey) =>
        SlugUtils.generate(
          `${plan.companySlug}-${categoryDefinitions[categoryKey].title}`,
        ),
      ),
    );

    await jobModel
      .deleteMany(
        {
          slug: {
            $in: slugs,
          },
        },
        { session },
      )
      .exec();

    logger.log(`Real fitness jobs seed rollback removed ${slugs.length} jobs.`);
  },
};

export default seed;
