
export enum LabType {
  CIRCLE = 'Circle Lab',
  TRIANGLE = 'Triangle Lab'
}

export enum LessonType {
  // Circle Lessons
  BASICS = 'Radius & Diameter',
  TANGENT = 'Tangents',
  SECTOR = 'Sectors',
  // Triangle Lessons
  INCENTER = 'The Incenter',
  INRADIUS = 'The Inradius',
  AREA_RELATION = 'Area & Inradius'
}

export interface Point {
  x: number;
  y: number;
}

export interface TriangleState {
  a: Point;
  b: Point;
  c: Point;
}

export interface CircleState {
  center: Point;
  radius: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
