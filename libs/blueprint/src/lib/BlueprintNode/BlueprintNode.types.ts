export type TBlueprintNodeDefinition = {
  label: string;
  input?: TBlueprintInput;
  output?: TBlueprintOutput;
  properties?: TBlueprintProperty[];
  color: string;
};

export type TBlueprintProperty = {
  name: string;
  input?: TBlueprintInput;
  output?: TBlueprintOutput;
  Renderer: (props: TPropertyRendererProps) => JSX.Element;
  label: string;
  minimizable?: boolean;
  minimizedByDefault?: boolean;
};

type TPropertyRendererProps = {
  value: unknown;
  onChange: (value: unknown) => void;
};

export type TBlueprintInput = {
  type: TBlueprintLinkType;
};

export type TBlueprintOutput = {
  type: TBlueprintLinkType;
};

export type TBlueprintLinkType = {
  color: string;
};
