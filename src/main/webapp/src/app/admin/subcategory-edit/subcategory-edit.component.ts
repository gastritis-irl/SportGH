import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subcategory } from '../../subcategory/subcategory.model';
import { CustomFieldType } from '../../subcategory/customFieldConfig.model';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-subcategory-edit',
    templateUrl: './subcategory-edit.component.html',
})
export class SubcategoryEditComponent implements OnInit {

    selectedFields: string[] = [''];
    subcategory: Subcategory = { id: undefined, name: '', categoryId: undefined, customFields: [{name: '', type: CustomFieldType.STRING }]};
    // @ViewChild('customFieldsContainer', { static: true }) customFieldsContainer: ElementRef | undefined;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    buttonPushed: boolean = false;
    paramCheck: 'create' | 'edit' = 'create';
    constructor(
        private subcategoryService: SubcategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
        private elementRef: ElementRef,
        private renderer: Renderer2,
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

    createSubcategoryData(): void {
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

    deleteCustomField(subcategoryIdAndIndex: number[], categoryId: number | undefined): void {
        this.subcategoryService.delete(subcategoryIdAndIndex[0]).subscribe(
            {
                next: (): void => {
                    // this.subcategories.splice(subcategoryIdAndIndex[1], 1);
                    this.router.navigate([`/admin/categories/${categoryId}`])
                        .then((): void => {
                            this.toastNotify.success(`Subcategory successfully deleted!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error('Error redirecting to route /admin/categories');
                        });
                },
                error: (error): void => {
                    this.toastNotify.error(`Error deleting category: ${error.error}`);
                }
            }
        );
    }

    onSelectChange(event: any, i: number) {
        this.selectedFields[i] = event.target.value;
        console.log(this.selectedFields);
    }

    newField(): void {
        const element = this.elementRef.nativeElement.querySelector('#customFieldsContainer');
        const newDiv = this.renderer.createElement("div");
        this.renderer.addClass(newDiv, "list-element")
        this.renderer.appendChild(element, newDiv);

        const itemDiv1 = this.renderer.createElement('div');
        this.renderer.addClass(itemDiv1, 'name');
        this.renderer.addClass(itemDiv1, 'row-item');
        this.renderer.appendChild(newDiv, itemDiv1);

        // const inputElement = this.renderer.createElement('input');
        // this.renderer.setAttribute(inputElement, 'class', 'form-part-input');
        // this.renderer.setAttribute(inputElement, 'type', 'text');
        // this.renderer.setAttribute(inputElement, 'name', 'name');
        // this.renderer.setAttribute(inputElement, 'placeholder', 'xd');
        // const ngModel = new NgModel(itemDiv1, [inputElement], [], []);
        // ngModel.name = 'field.name';
        // this.renderer.appendChild(itemDiv1, inputElement);

        const itemDiv2 = this.renderer.createElement('div');
        this.renderer.addClass(itemDiv2, 'name');
        this.renderer.addClass(itemDiv2, 'row-item');
        this.renderer.appendChild(newDiv, itemDiv2);

        const button = this.renderer.createElement('button');
        const buttonText = this.renderer.createText('Click me');
        this.renderer.appendChild(button, buttonText);
        this.renderer.appendChild(itemDiv2, button);

    }

    protected readonly Object = Object;
    protected readonly CustomFieldType = CustomFieldType;
}
