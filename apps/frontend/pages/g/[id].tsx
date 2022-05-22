import React from 'react';

import { GetServerSideProps } from 'next';
import { Game } from '@sawane/game';
import { demoGame } from '../../src/demo/demo';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      game: demoGame,
    },
  };
};

const GameRoute = ({ game }) => {
  return <Game game={game} />;
};

export default GameRoute;
