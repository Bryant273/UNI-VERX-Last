import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      <label *ngIf="label" [for]="id" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
        {{ label }} <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <i *ngIf="icon" [class]="'pi ' + icon + ' absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'"></i>
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [class]="getInputClasses()"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onTouched()"
        />
      </div>
      <span *ngIf="error" class="text-sm text-red-500">{{ error }}</span>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() id: string = `input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error?: string;
  @Input() icon?: string;
  @Input() required: boolean = false;
  
  value: string = '';
  disabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  getInputClasses(): string {
    const baseClasses = 'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow';
    const iconPadding = this.icon ? 'pl-10' : '';
    const errorClasses = this.error ? 'border-red-500 focus:ring-red-500' : '';
    
    return `${baseClasses} ${iconPadding} ${errorClasses}`;
  }
}
