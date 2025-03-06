// declarations.d.ts
declare module 'wordcloud' {
    interface WordCloudOptions {
      list?: [string, number][];
      gridSize?: number;
      weightFactor?: number | ((size: number) => number);
      fontFamily?: string;
      color?: string | ((word: string, weight: number | string) => string);
      backgroundColor?: string;
      rotateRatio?: number;
      rotationSteps?: number;
      shape?: 'circle' | 'cardioid' | 'diamond' | 'square' | 'triangle-forward' | 'triangle' | 'pentagon' | 'star';
      ellipticity?: number;
      classes?: (word: string) => string;
      hover?: (item: [string, number], dimension: DOMRect, event: MouseEvent) => void;
      click?: (item: [string, number]) => void;
      shrinkToFit?: boolean;
      drawOutOfBound?: boolean;
      minSize?: number;
    }
  
    const wordcloud: (element: HTMLElement, options: WordCloudOptions) => void;
    export default wordcloud;
  }