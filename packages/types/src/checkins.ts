export interface CheckIn {
  date: Date;
  weight?: number;
  calories?: number;
}

export interface ComputedCheckIn extends CheckIn {
  averageWeight?: number;
  BMI?: number;
}
