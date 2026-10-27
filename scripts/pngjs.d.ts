// Minimal ambient types for the pngjs sync API used by scripts/cutout.ts.
declare module 'pngjs' {
  export class PNG {
    width: number;
    height: number;
    data: Buffer;
    static sync: {
      read(buffer: Buffer): PNG;
      write(png: PNG): Buffer;
    };
  }
}
