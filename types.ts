export interface Genre {
  id: string;
  label: string;
}

export interface StoryLength {
  id: string;
  label: string;
}

export interface StoryRequest {
  topic: string;
  genre: Genre;
  length: StoryLength;
  includeDiagram: boolean;
  includeExamples: boolean;
}

export interface DiagramNode {
  id: string;
  label: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface DiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface StoryResponse {
  story: string;
  diagram: DiagramData | null;
  examples: string | null;
}
