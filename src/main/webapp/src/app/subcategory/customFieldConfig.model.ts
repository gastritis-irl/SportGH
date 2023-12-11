export enum CustomFieldType {
    STRING = "STRING",
    NUMBER = "NUMBER"
}

export interface customFieldConfig {
    name: string;
    type: CustomFieldType;
}
