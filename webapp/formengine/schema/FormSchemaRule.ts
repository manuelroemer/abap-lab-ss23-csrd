export interface FormSchemaRule {
  effect: FormSchemaRuleEffect;
  conditions: Array<any>;
  satisfy?: 'all' | 'any';
}

export type FormSchemaRuleEffect = 'hide';
