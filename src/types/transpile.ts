type parse_type = 'script' | 'module';

export interface transpile_options {
  parse_type: parse_type;
  additional_callees: string[];
  object_name?: string; // if the passed code does not include an object declaration this should be specified
}
