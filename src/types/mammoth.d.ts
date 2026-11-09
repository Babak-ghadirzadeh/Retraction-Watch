declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export function extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
  export function extractRawText(options: { buffer: Buffer }): Promise<MammothResult>;
}
