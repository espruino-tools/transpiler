export interface generator_options {
  object_name?: string; // if the passed code does not include an object declaration this should be specified
  additional_callees?: any[];
  additional_initialisers?: string[];
}
