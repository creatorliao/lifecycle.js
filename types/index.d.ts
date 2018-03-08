declare namespace Lifecycle {
  export interface Options {
    autoStart?: boolean;
    autoEmit?: boolean;
    autoEnd?: boolean;
  }

  export interface OnOptions {
    once?: boolean;
    prepend?: boolean;
  }
}

declare class Lifecycle {
  constructor(target: object, stages: string[] | object, options?: Lifecycle.Options);
  start(): Lifecycle;
  end(): Lifecycle;
  prev(): Lifecycle;
  next(): Lifecycle;
  goto(stage: string): Lifecycle;
  on(stage: string | string[] | object, hook?: Function | Function[], options?: Lifecycle.OnOptions): Lifecycle;
  once(stage: string | string[] | object, hook?: Function | Function[], options?: Lifecycle.OnOptions): Lifecycle;
  off(stage: string | string[] | object, hook?: Function | Function[]): Lifecycle;
  emit(stage: string | string[]): any;
  is(stage: string): boolean;
}

declare module 'lifecycle.js' {
  export default Lifecycle;
}
