
export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface GeneratedApp {
  name: string;
  description: string;
  files: GeneratedFile[];
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
