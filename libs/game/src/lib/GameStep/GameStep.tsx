import { TGameStep, TGameStepAction } from '@sawane/types';
import { useEffect } from 'react';
import { useGameContext } from '../game';

import styles from './GameStep.module.scss';

type TGameStepProps = {
  step: TGameStep;
  handleChangeStep: (stepId: string) => void;
  handleChangeChapter: (chapterId: string) => void;
};

export const GameStep = ({
  step,
  handleChangeStep,
  handleChangeChapter,
}: TGameStepProps) => {
  const { changeBackground } = useGameContext();

  useEffect(() => {
    if (step.backgroundImage) {
      changeBackground(step.backgroundImage);
    }
  }, [step]);

  const executeAction = (action: TGameStepAction) => {
    const { linkTo } = action;

    if (linkTo.type === 'step') {
      handleChangeStep(linkTo.stepId);
    } else if (linkTo.type === 'chapter') {
      handleChangeChapter(linkTo.chapterId);
    }
  };

  return (
    <div className={styles['GameStep']}>
      <div>
        <div className={styles['text']}>{step.text}</div>

        <div className={styles['actions']}>
          {step.actions.map((action) => (
            <GameStepAction
              key={action.id}
              action={action}
              onClick={() => {
                executeAction(action);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const GameStepAction = ({
  action,
  onClick,
}: {
  action: TGameStepAction;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={() => {
        onClick();
      }}
    >
      {action.text}
    </button>
  );
};
