export interface ICheckIn {
  date: Date;
  weight?: number;
  calories?: number;
}

export interface IComputedCheckIn extends ICheckIn {
  averageWeight?: number;
}
