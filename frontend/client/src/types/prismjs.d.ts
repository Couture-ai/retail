declare module 'prismjs' {
  namespace Prism {
    function highlight(code: string, grammar: any, language: string): string;
    const languages: Record<string, any>;
  }
  export = Prism;
}