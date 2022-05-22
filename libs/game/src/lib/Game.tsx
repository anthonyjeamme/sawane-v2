import React, { createContext, useEffect, useRef, useState } from 'react';

import { GameChapter } from './GameChapter/GameChapter';

import { TGame } from '@sawane/types';

import styles from './Game.module.scss';

type TGameProps = {
  game: TGame;
};

type TGameContext = {
  currentBackground: string | null;
  changeBackground: (imageURL: string | null) => void;
  currentAudio: string | null;
  changeAudio: (audioURL: string | null) => void;
};

const gameContext = createContext<TGameContext>({
  currentBackground: null,
  changeBackground: () => {
    //
  },
  currentAudio: null,
  changeAudio: () => {
    //
  },
});

export const Game = ({ game }: TGameProps) => {
  const [currentChapter, setCurrentChapter] = useState(game.chapters[0]);

  const [currentBackground, setCurrentBackground] = useState<string | null>(
    null
  );

  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  console.log(currentBackground);

  const handleChangeChapter = (chapterId: string) => {
    const chapter = game.chapters.find(({ id }) => id === chapterId);

    if (!chapter) {
      console.log(`Can't find ${chapterId} chapter`);
      return;
    }

    setCurrentChapter(chapter);
  };

  const changeBackground = (imageURL: string | null) => {
    setCurrentBackground(imageURL);
  };

  const changeAudio = (audioURL: string | null) => {
    setCurrentAudio(audioURL);
  };

  return (
    <gameContext.Provider
      value={{
        currentBackground,
        changeBackground,
        currentAudio,
        changeAudio,
      }}
    >
      <div className={styles['Game']}>
        <BackgroundImage backgroundImage={currentBackground} />
        <div style={{ position: 'relative', zIndex: 1000000 }}>
          <GameChapter
            chapter={currentChapter}
            handleChangeChapter={handleChangeChapter}
          />
        </div>
      </div>
    </gameContext.Provider>
  );
};

export const useGameContext = () => React.useContext(gameContext);

const BackgroundImage = ({ backgroundImage }: { backgroundImage: string }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const transitionImageRef = useRef<HTMLImageElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!transitionImageRef.current || !imageRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      imageRef.current.src = transitionImageRef.current.src;
    }

    transitionImageRef.current.src = backgroundImage;

    timeoutRef.current = setTimeout(() => {
      if (!imageRef.current) return;

      imageRef.current.src = backgroundImage;
      timeoutRef.current = null;
    }, 1100);
  }, [backgroundImage]);

  return (
    <div className={styles['BackgroundImage']}>
      <img ref={imageRef} alt="" />
      <img
        alt=""
        ref={transitionImageRef}
        key={backgroundImage}
        className={styles['transition-image']}
      />
    </div>
  );
};
