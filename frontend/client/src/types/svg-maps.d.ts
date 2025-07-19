declare module '@svg-maps/india' {
  interface Location {
    id: string;
    name: string;
    path: string;
  }

  interface SVGMap {
    viewBox: string;
    locations: Location[];
  }

  const india: SVGMap;
  export default india;
} 