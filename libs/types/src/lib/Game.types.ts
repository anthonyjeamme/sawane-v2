export type TGame = {
  id: string;
  title: string;
  description: string;
  chapters: TGameChapter[];
  entryChapterId: string;
  visibility: TGameVisibility;
  contributors: TGameContributor[];
};

export type TGameVisibility = 'public' | 'unlisted' | 'private';

export type TGameContributor = {
  role: TGameContributorRole;
};
export type TGameContributorRole = 'admin' | 'writer';

export type TGameChapter = {
  id: string;
  title: string;
  steps: TGameStep[];
  entryStepId: string;
};

export type TGameStep = {
  id: string;
  type: TGameStepType;
  text: string;
  actions: TGameStepAction[];
  backgroundImage?: string;
};

export type TGameStepAction = {
  id: string;
  text: string;
  linkTo:
    | TGameStepActionStepLink
    | TGameStepActionChapterLink
    | TGameStepActionEndLink;
  sideEffects: TGameStepActionSideEffect[];
};

export type TGameStepActionStepLink = {
  type: 'step';
  stepId: string;
};
export type TGameStepActionChapterLink = {
  type: 'chapter';
  chapterId: string;
};
export type TGameStepActionEndLink = {
  type: 'end';
};

export type TGameStepType = 'text';

export type TGameStepActionSideEffect = {
  type: 'update-variable';
  variableName: string;
  update: any; // TODO
};
