
export interface Student {
  id: string;
  name: string;
  photoUrl: string;
}

export interface AppState {
  students: Student[];
  remainingStudents: Student[];
  isSpinning: boolean;
  winner: Student | null;
  wheelCenterText: string;
}
