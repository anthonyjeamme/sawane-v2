import { classNameModule } from '@sawane/utils';
import { CaretRight, X } from 'phosphor-react';
import { useState } from 'react';
import styles from './BlueprintSidebar.module.scss';

const className = classNameModule(styles);

export const BlueprintSidebar = () => {
  const [reduced, setReduced] = useState(false);

  return (
    <div {...className('BlueprintSidebar', { reduced })}>
      <header>
        <button
          className={styles['close-button']}
          onClick={() => {
            setReduced(!reduced);
          }}
        >
          <CaretRight />
        </button>
      </header>

      {!reduced && (
        <>
          <div>BlueprintSidebar</div>
          <div>BlueprintSidebar</div>
        </>
      )}
    </div>
  );
};
