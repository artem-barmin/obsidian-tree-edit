export interface IAction<T, P = void> {
  type: T;
  payload?: P;
}
