declare const __DEBUG__: boolean;
declare function __ASSERT__(cond: boolean, msg: string): asserts cond is true;

declare function __LOAD_FILE__(file: string): string;