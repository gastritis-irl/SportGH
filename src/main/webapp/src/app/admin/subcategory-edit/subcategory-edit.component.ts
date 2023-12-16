import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subcategory } from '../../subcategory/subcategory.model';
import { CustomFieldType } from '../../subcategory/customFieldConfig.model';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/category.model';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-subcategory-edit',
    templateUrl: './subcategory-edit.component.html',
    styleUrls: [ './subcategory-edit.component.scss' ],
})
export class SubcategoryEditComponent implements OnInit {

    selectedFields: string[] = [];
    category: Category  = {id: undefined, name: '', imageId: 0};
    subcategory: Subcategory = { id: undefined, name: '', categoryId: undefined, customFields: [{name: '', type: CustomFieldType.STRING }]};
    @ViewChildren('inputField') inputFields: QueryList<ElementRef> | undefined;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    buttonPushed: boolean = false;
    paramCheck: 'create' | 'edit' = 'create';
    constructor(
        private subcategoryService: SubcategoryService,
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.loadDataByParam();
    }

    loadDataByParam(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData([params['categoryId'], params['subcategoryId']]);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(params: (string | undefined)[]): void {
        if (params) {
            if (params[1] === 'new') {
                this.paramCheck = 'create';
                if (params[0]) {
                    this.subcategory.categoryId = parseInt(params[0]);
                }
                this.clickHandlerFunction = this.createSubcategoryData;
                this.editMode = false;
            }
            if(params[1]) {
                const id: number = parseInt(params[1]);
                if (!isNaN(id)) {
                    this.paramCheck = 'edit';
                    this.clickHandlerFunction = this.updateSubcategoryData;
                    this.editMode = true;
                    this.subcategoryService.getById(id).subscribe(
                        {
                            next: (data: Subcategory) => {
                                this.subcategory = data;
                                if(this.subcategory.categoryId) {
                                    this.categoryService.getById(this.subcategory.categoryId).subscribe({
                                        next: (data: Category) => {
                                            this.category = data;
                                        },
                                        error: (error) => {
                                            console.error(error);
                                            this.toastNotify.error(`Error fetching data`);
                                        }
                                    });
                                }
                            },
                            error: (error) => {
                                console.error(error);
                                this.toastNotify.error(`Error fetching data`);
                            }
                        }
                    );
                }
            }
        }
    }

    checkInputFields(): void {
        if (this.inputFields && this.subcategory.customFields !== null) {
            this.inputFields.forEach((input: ElementRef, i: number) => {
                this.subcategory.customFields[i].name = input.nativeElement.value;
                if (this.selectedFields[i]) {
                    this.subcategory.customFields[i].type = <CustomFieldType>this.selectedFields[i];
                }
            });
            this.subcategory.customFields = this.subcategory.customFields.filter(field => field.name !== '');
        }
    }

    createSubcategoryData(): void {
        this.checkInputFields();
        this.subcategoryService.create(this.subcategory).subscribe(
            {
                next: (resp: Subcategory): void => {
                    this.router.navigate([`/admin/categories/${this.subcategory.categoryId}`])
                        .then((): void => {
                            this.toastNotify.success(`Subcategory "${resp.name}" successfully created!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error(`Error redirecting to route '/admin/categories`);
                        });
                },
                error: (error): void => {
                    if (error.status === 0) {
                        this.toastNotify.error('Error creating category: unauthorized');
                    } else {
                        this.toastNotify.error(`Error creating category: ${error.error}`);
                    }
                }
            }
        );
    }

    updateSubcategoryData(): void {
        this.checkInputFields()
        this.subcategoryService.update(this.subcategory.id, this.subcategory).subscribe(
            {
                next: (): void => {
                    this.router.navigate([`/admin/categories/${this.subcategory.categoryId}`])
                        .then((): void => {
                            this.toastNotify.success(`Subcategory successfully updated!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error(`Error redirecting to route /admin/categories`);
                        });
                },
                error: (error: { status: number; error: undefined }): void => {
                    if (error.status === 0) {
                        this.toastNotify.error('Error creating category: unauthorized');
                    } else {
                        this.toastNotify.error(`Error creating category: ${error.error}`);
                    }
                }
            }
        );
    }

    deleteCustomField(customFieldIndex: number[]): void {
        this.subcategory.customFields = this.subcategory.customFields.slice(0, customFieldIndex[0]).concat(this.subcategory.customFields.slice(customFieldIndex[0] + 1));
    }

    onSelectChange(event: Event, i: number) {
        this.selectedFields[i] = (event.target as HTMLInputElement).value;
    }

    newField(): void {
        if (this.subcategory.customFields) {
            this.subcategory.customFields.push({ name: '', type: CustomFieldType.STRING });
        } else {
            this.subcategory.customFields = [{ name: '', type: CustomFieldType.STRING }];
        }
    }

    protected readonly Object = Object;
    protected readonly CustomFieldType = CustomFieldType;
}
