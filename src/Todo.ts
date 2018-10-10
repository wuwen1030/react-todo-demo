export default interface Todo {
  id: number,
  title: string,
  completed: boolean
}

export enum TodoFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed'
}