export interface FormField<T> {
  value?: T,
  onChange?: (value: T) => void
}
