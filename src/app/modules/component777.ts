
import { Component } from '@angular/core';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';

@Component({
  standalone: false,
  selector: 'app-component777',
  preserveWhitespaces: false,
  template: `
    <p>component777 works!</p>
    <span *ngIf="_isShow"></span>
    <button nz-button> 这是按钮 </button>
    <nz-select
      [nzMaxTagCount]="3"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      nzMode="multiple"
      nzPlaceHolder="Please select"
      [(ngModel)]="listOfSelectedValue"
    >
      @for (item of listOfOption; track item) {
        <nz-option [nzLabel]="item" [nzValue]="item"></nz-option>
      }
    </nz-select>
    <ng-template #tagPlaceHolder let-selectedList>and {{ selectedList.length }} more selected</ng-template>
    <nz-input-number [(ngModel)]="valueN" nzMin="1" nzMax="10" />
    <nz-color-picker></nz-color-picker>
    <input nz-input placeholder="Basic usage" [(ngModel)]="value" type="number" />
    <nz-date-picker [(ngModel)]="date" (ngModelChange)="onChanges($event)"></nz-date-picker>
    <label nz-checkbox [(ngModel)]="checked">Checkbox</label>
    <nz-cascader [nzOptions]="options" [(ngModel)]="values" (ngModelChange)="onChanges($event)"></nz-cascader>
  `,
  styles: ['span { display: block; color: red; }']
})
export class AppComponent777Component {
  _isShow = true;
  values: string[] | null = null;
  date = null;
  valueN = 1;
  value = '';
  listOfSelectedValue = ['a10', 'c12'];
  checked = false;
  onChanges(value: string): void {
    console.log(value, this.values);
  }
    listOfOption: string[]

  constructor() {
  this.listOfOption = this.alphabet();
  }

  alphabet(): string[] {
    const children: string[] = [];
    for (let i = 10; i < 36; i++) {
      children.push(i.toString(36) + i);
    }
    return children;
  }
  options: NzCascaderOption[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            isLeaf: true
          }
        ]
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        isLeaf: true
      }
    ]
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            isLeaf: true
          }
        ]
      }
    ]
  }
];
}
