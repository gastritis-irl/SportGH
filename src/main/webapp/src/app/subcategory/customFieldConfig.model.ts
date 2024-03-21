export enum CustomFieldType {
    STRING = 'STRING',
    NUMBER = 'NUMBER'
}

export interface CustomFieldConfig {
    name: string;
    type: CustomFieldType;
}

export interface CustomFieldValue {
    value: string | number | null;
    config: CustomFieldConfig;
}
