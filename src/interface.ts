// >>>>> Rule
// Modified from https://github.com/yiminghe/async-validator/blob/0d51d60086a127b21db76f44dff28ae18c165c47/src/index.d.ts
export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'pattern'
  | 'any';

export interface ValidateOption {
  // whether to suppress internal warning
  suppressWarning?: boolean;

  // whether to suppress validator error
  suppressValidatorError?: boolean;

  // when the first validation rule generates an error stop processed
  first?: boolean;

  // when the first validation rule of the specified field generates an error stop the field processed, 'true' means all fields.
  firstFields?: boolean | string[];

  messages?: Partial<ValidateMessages>;

  /** The name of rules need to be trigger. Will validate all rules if leave empty */
  keys?: string[];

  error?: (rule: InternalRuleItem, message: string) => ValidateError;
}

export type SyncErrorType = Error | string;
export type SyncValidateResult = boolean | SyncErrorType | SyncErrorType[];
export type ValidateResult = void | Promise<void> | SyncValidateResult;

export interface RuleItem {
  type?: RuleType; // default type is 'string'
  required?: boolean;
  pattern?: RegExp | string;
  min?: number; // Range of type 'string' and 'array'
  max?: number; // Range of type 'string' and 'array'
  len?: number; // Length of type 'string' and 'array'
  enum?: Array<string | number | boolean | null | undefined>; // possible values of type 'enum'
  whitespace?: boolean;
  fields?: Record<string, Rule>; // ignore when without required
  options?: ValidateOption;
  defaultField?: Rule; // 'object' or 'array' containing validation rules
  transform?: (value: Value) => Value;
  localizedField?: string;
  message?: string | ((a?: string) => string);
  asyncValidator?: (
    rule: InternalRuleItem,
    value: Value,
    callback: (error?: string | Error) => void,
    source: Values,
    options: ValidateOption,
  ) => void | Promise<void>;
  validator?: (
    rule: InternalRuleItem,
    value: Value,
    callback: (error?: string | Error) => void,
    source: Values,
    options: ValidateOption,
  ) => SyncValidateResult | void;
}

export type Rule = RuleItem | RuleItem[];

export type Rules = Record<string, Rule>;

/**
 *  Rule for validating a value exists in an enumerable list.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 *  @param type Rule type
 */
export type ExecuteRule = (
  rule: InternalRuleItem,
  value: Value,
  source: Values,
  errors: string[],
  options: ValidateOption,
  type?: string,
) => void;

/**
 *  Performs validation for any type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
export type ExecuteValidator = (
  rule: InternalRuleItem,
  value: Value,
  callback: (error?: string[]) => void,
  source: Values,
  options: ValidateOption,
) => void;

// >>>>> Message
type ValidateMessage<T extends any[] = unknown[]> =
  | string
  | ((...args: T) => string);
type FullField = string | undefined;
type LocalizedField = string | undefined;
type EnumString = string | undefined;
type Pattern = string | RegExp | undefined;
type Range = number | undefined;
type Type = string | undefined;

export interface ValidateMessages {
  default?: ValidateMessage;
  required?: ValidateMessage<[LocalizedField | FullField]>;
  enum?: ValidateMessage<[LocalizedField | FullField, EnumString]>;
  whitespace?: ValidateMessage<[LocalizedField | FullField]>;
  date?: {
    format?: ValidateMessage;
    parse?: ValidateMessage;
    invalid?: ValidateMessage;
  };
  types?: {
    string?: ValidateMessage<[LocalizedField | FullField, Type]>;
    method?: ValidateMessage<[LocalizedField | FullField, Type]>;
    array?: ValidateMessage<[LocalizedField | FullField, Type]>;
    object?: ValidateMessage<[LocalizedField | FullField, Type]>;
    number?: ValidateMessage<[LocalizedField | FullField, Type]>;
    date?: ValidateMessage<[LocalizedField | FullField, Type]>;
    boolean?: ValidateMessage<[LocalizedField | FullField, Type]>;
    integer?: ValidateMessage<[LocalizedField | FullField, Type]>;
    float?: ValidateMessage<[LocalizedField | FullField, Type]>;
    regexp?: ValidateMessage<[LocalizedField | FullField, Type]>;
    email?: ValidateMessage<[LocalizedField | FullField, Type]>;
    url?: ValidateMessage<[LocalizedField | FullField, Type]>;
    hex?: ValidateMessage<[LocalizedField | FullField, Type]>;
  };
  string?: {
    len?: ValidateMessage<[LocalizedField | FullField, Range]>;
    min?: ValidateMessage<[LocalizedField | FullField, Range]>;
    max?: ValidateMessage<[LocalizedField | FullField, Range]>;
    range?: ValidateMessage<[LocalizedField | FullField, Range, Range]>;
  };
  number?: {
    len?: ValidateMessage<[LocalizedField | FullField, Range]>;
    min?: ValidateMessage<[LocalizedField | FullField, Range]>;
    max?: ValidateMessage<[LocalizedField | FullField, Range]>;
    range?: ValidateMessage<[LocalizedField | FullField, Range, Range]>;
  };
  array?: {
    len?: ValidateMessage<[LocalizedField | FullField, Range]>;
    min?: ValidateMessage<[LocalizedField | FullField, Range]>;
    max?: ValidateMessage<[LocalizedField | FullField, Range]>;
    range?: ValidateMessage<[LocalizedField | FullField, Range, Range]>;
  };
  pattern?: {
    mismatch?: ValidateMessage<[LocalizedField | FullField, Value, Pattern]>;
  };
}

export interface InternalValidateMessages extends ValidateMessages {
  clone: () => InternalValidateMessages;
}

// >>>>> Values
export type Value = any;
export type Values = Record<string, Value>;

// >>>>> Validate
export interface ValidateError {
  message?: string;
  fieldValue?: Value;
  field?: string;
}

export type ValidateFieldsError = Record<string, ValidateError[]>;

export type ValidateCallback = (
  errors: ValidateError[] | null,
  fields: ValidateFieldsError | Values,
) => void;

export interface RuleValuePackage {
  rule: InternalRuleItem;
  value: Value;
  source: Values;
  field: string;
}

export interface InternalRuleItem extends Omit<RuleItem, 'validator'> {
  field?: string;
  fullField?: string;
  localizedField?: string;
  fullFields?: string[];
  validator?: RuleItem['validator'] | ExecuteValidator;
}
