import { classNameModule } from '@sawane/utils';
import { CaretCircleDown } from 'phosphor-react';
import React, { useEffect, useRef, useState } from 'react';

import styles from './BlueprintNode.module.scss';
import {
  TBlueprintNodeDefinition,
  TBlueprintProperty,
} from './BlueprintNode.types';

const className = classNameModule(styles);

interface TBlueprintNodeProps {
  definition: TBlueprintNodeDefinition;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}

export const BlueprintNode = ({
  definition,
  value,
  onChange,
}: TBlueprintNodeProps) => {
  return (
    <div className={styles['BlueprintNode']}>
      <BlueprintProperties
        definition={definition}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

interface TNodeInOutProps {
  definition: TBlueprintNodeDefinition;
}

const NodeInOut = ({ definition }: TNodeInOutProps) => {
  return (
    <div className={styles['NodeInOut']}>
      {definition.input && (
        <ConnexionPoint type="input" color={definition.input.type.color} />
      )}
      {definition.output && (
        <ConnexionPoint type="output" color={definition.output.type.color} />
      )}
    </div>
  );
};

interface TBlueprintNodeHeaderProps {
  definition: TBlueprintNodeDefinition;
}

const BlueprintNodeHeader = ({ definition }: TBlueprintNodeHeaderProps) => {
  return <div className={styles['BlueprintNodeHeader']}></div>;
};

const BlueprintProperties = ({
  definition,
  value,
  onChange,
}: TBlueprintNodeProps) => {
  return (
    <div className={styles['BlueprintProperties']}>
      {definition.properties?.map((property) => (
        <BlueprintProperty
          property={property}
          value={value[property.name]}
          onChange={(update) => {
            onChange({
              ...value,
              [property.name]: update,
            });
          }}
        />
      ))}
    </div>
  );
};

const ConnexionPoint = ({
  type,
  color,
}: {
  type: 'input' | 'output';
  color: string;
}) => {
  return (
    <div
      {...className('ConnexionPoint', type)}
      style={{ color }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {/* <InputIcon color={color} /> */}
    </div>
  );
};

interface TBlueprintPropertyProps {
  property: TBlueprintProperty;
  value: unknown;
  onChange: (value: unknown) => void;
}

const BlueprintProperty = ({
  property,
  value,
  onChange,
}: TBlueprintPropertyProps) => {
  const { Renderer } = property;
  const [isOpen, setIsOpen] = useState(
    property.minimizedByDefault ? false : true
  );

  return (
    <div className={styles['BlueprintProperty']}>
      <button
        {...className('header', { minimizable: property.minimizable || false })}
        onClick={() => {
          if (property.minimizable) setIsOpen(!isOpen);
        }}
      >
        <span>{property.label}</span>

        <span>
          {property.minimizable && (
            <span {...className('caret', { isOpen })}>
              <CaretCircleDown />
            </span>
          )}
        </span>
      </button>

      <AutoResizeBlock isOpen={isOpen}>
        <div className={styles['BlueprintPropertyContent']}>
          <Renderer
            value={value}
            onChange={(value) => {
              onChange(value);
            }}
          />
        </div>
      </AutoResizeBlock>

      {property.input && (
        <ConnexionPoint type="input" color={property.input.type.color} />
      )}
      {property.output && (
        <ConnexionPoint type="output" color={property.output.type.color} />
      )}
    </div>
  );
};

const InputIcon = ({ color }: { color: string }) => (
  <svg height={12} viewBox="0 0 74.64 100">
    <path
      d="M71.71,57.07,34.64,94.14A20,20,0,0,1,20.5,100H10A10,10,0,0,1,0,90V10A10,10,0,0,1,10,0H20.5A20,20,0,0,1,34.64,5.86L71.71,42.93A10,10,0,0,1,71.71,57.07Z"
      fill={color}
    />
  </svg>
);

const OutputIcon = () => (
  <svg height={12} viewBox="0 0 74.64 100">
    <path
      d="M2.93,42.93,40,5.86A20,20,0,0,1,54.14,0h10.5a10,10,0,0,1,10,10V90a10,10,0,0,1-10,10H54.14A20,20,0,0,1,40,94.14L2.93,57.07A10,10,0,0,1,2.93,42.93Z"
      fill="black"
    />
  </svg>
);

const AutoResizeBlock: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
}> = ({ isOpen, children }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !containerRef.current) return;

    if (isOpen) {
      rootRef.current.style.height = containerRef.current.offsetHeight + 'px';
      rootRef.current.style.opacity = '1';
    } else {
      rootRef.current.style.height = '0px';
      rootRef.current.style.opacity = '0';
    }
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      style={{ overflow: 'hidden', transition: 'height 250ms, opacity 250ms' }}
    >
      <div ref={containerRef}>{children}</div>
    </div>
  );
};
