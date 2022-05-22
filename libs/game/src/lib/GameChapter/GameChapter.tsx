import { useEffect, useState } from 'react';
import { TGameChapter } from '@sawane/types';
import { GameStep } from '../GameStep/GameStep';

import styles from './GameChapter.module.scss';

type TGameChapterProps = {
  chapter: TGameChapter;
  handleChangeChapter: (chapterId: string) => void;
};

export const GameChapter = ({
  chapter,
  handleChangeChapter,
}: TGameChapterProps) => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [currentStep, setCurrentStep] = useState(
    chapter.steps.find(({ id }) => id === chapter.entryStepId) || null
  );

  const handleChangeStep = (stepId: string) => {
    const step = chapter.steps.find(({ id }) => id === stepId);

    if (!step) {
      console.log(`Can't find ${stepId} step`);
      return;
    }

    setCurrentStep(step);
  };

  useEffect(() => {
    setShowIntroduction(true);

    setCurrentStep(
      chapter.steps.find(({ id }) => id === chapter.entryStepId) || null
    );
  }, [chapter]);

  if (!currentStep) return <div>ERROR NO STEP</div>;

  return (
    <div className={styles['GameChapter']}>
      {showIntroduction ? (
        <ChapterIntroduction
          chapter={chapter}
          handleNext={() => {
            setShowIntroduction(false);
          }}
        />
      ) : (
        <GameStep
          key={currentStep?.id}
          step={currentStep}
          handleChangeStep={handleChangeStep}
          handleChangeChapter={handleChangeChapter}
        />
      )}
    </div>
  );
};

const ChapterIntroduction = ({
  chapter,
  handleNext,
}: {
  chapter: TGameChapter;
  handleNext: () => void;
}) => {
  useEffect(() => {
    setTimeout(() => {
      handleNext();
    }, 3100);
  }, []);

  return (
    <div className={styles['ChapterIntroduction']}>
      <div>
        <h2>{chapter.title}</h2>
      </div>
    </div>
  );
};
