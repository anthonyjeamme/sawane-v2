import { TGame } from '@sawane/types';

export const demoGame: TGame = {
  id: 'x',
  title: 'test',
  visibility: 'private',
  description: '',
  chapters: [
    {
      id: '0',
      entryStepId: 'a',
      steps: [
        {
          id: 'a',
          text: `Vous vous réveillez à 15 heures du matin en compagnie de trois petites allongées sur le lit. Une sous chaque bras et une troisième allongée sur vous. Vous avez de vagues souvenirs d'une soirée mouvementée.`,
          type: 'text',
          backgroundImage:
            'https://res.cloudinary.com/anthony-jeamme-stuff/image/upload/v1653087249/ETT8FB8UEAAmv7A_mugvz7.jpg',
          actions: [
            {
              id: 'X',
              linkTo: {
                stepId: 'b',
                type: 'step',
              },
              sideEffects: [],
              text: 'Se lever sans faire de bruit',
            },
            {
              id: 'Y',
              linkTo: {
                stepId: 'b',
                type: 'step',
              },
              sideEffects: [],
              text: `Commencer à caresser l'une des filles`,
            },
          ],
        },
        {
          id: 'b',
          text: `Vous retirez délicatement vos bras de sous la tête des deux filles.
            Vous faite glisser sur le coté la troisième et sur la pointe des pieds, vous tentez de quitter la pièce.
            
            Soudain, quelqu'un tape à la porte`,
          type: 'text',
          backgroundImage:
            'https://res.cloudinary.com/anthony-jeamme-stuff/image/upload/v1653092106/661727_yvbzxs.jpg',
          actions: [
            {
              id: 'X',
              linkTo: {
                stepId: 'a',
                type: 'step',
              },
              sideEffects: [],
              text: 'Chapitre 2',
            },
          ],
        },
      ],
      title: 'Chapitre 1 : Réveil difficile',
    },
    {
      id: '1',
      entryStepId: 'a',
      steps: [
        {
          id: 'a',
          actions: [],
          text: 'Chapter 2',
          type: 'text',
        },
      ],
      title: 'Chapitre 2 : Une aventure qui commence',
    },
  ],
  entryChapterId: '0',
  contributors: [],
};
