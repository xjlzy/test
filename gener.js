const fs = require("fs");
const path = require("path");

const cmpMap = {};

const modulesPath = path.resolve(__dirname, "src/app/modules");

// await ensureDir(modulesPath);
if (!fs.existsSync(modulesPath)) {
  fs.mkdirSync(modulesPath);
}

// 生成10000个angular组件
const componentTemplate = (name) => `
import { Component } from '@angular/core';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';

@Component({
  standalone: false,
  selector: 'app-${name}',
  preserveWhitespaces: false,
  template: \`
    <p>${name} works!</p>
    <span *ngIf="_isShow"></span>
    <button nz-button> 这是按钮 撒发发发</button>
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
  \`,
  styles: ['span { display: block; color: red; }']
})
export class App${capitalize(name)}Component {
  _isShow = ${Math.random() > 0.5 ? "true" : "false"};
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
`;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const generateComponents = (count) => {
  for (let i = 1; i <= count; i++) {
    const componentName = `component${i}`;
    // cmpArr.push(`App${capitalize(`componentName`)}Component`)
    cmpMap[componentName] = `App${capitalize(componentName)}Component`;
    const componentPath = path.join(modulesPath, `${componentName}.ts`);

    fs.writeFileSync(componentPath, componentTemplate(componentName));
  }
};

generateComponents(10000);

const moduleTemplate = () => {
  const func = (idx, importStr, declareStr) => {
    const str = `
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { NzSelectModule } from 'ng-zorro-antd/select';
    import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
    import { NzInputModule } from 'ng-zorro-antd/input';
    import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
    import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
    import { NzCascaderModule } from 'ng-zorro-antd/cascader';
    import { NzButtonModule } from 'ng-zorro-antd/button';
    import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
    import { FormsModule } from "@angular/forms";
    ${importStr}

    @NgModule({
      imports: [CommonModule, NzSelectModule, NzInputNumberModule, NzInputModule, NzDatePickerModule, NzCheckboxModule, NzCascaderModule, NzButtonModule, NzColorPickerModule, FormsModule],
      declarations: [${declareStr}]
    })
    export class AppModules${idx}Module {}
  `;

    fs.writeFileSync(
      path.join(modulesPath, `app-modules${idx}.module.ts`),
      str
    );
  };
  const importArr = [],
    declareArr = [];
  Object.keys(cmpMap).forEach((key, idx) => {
    idx = idx + 1;
    importArr.push(`import { ${cmpMap[key]} } from './${key}';`);
    declareArr.push(cmpMap[key]);
    if (idx % 100 === 0) {
      func(idx / 100, importArr.join("\n"), declareArr.join(",\n"));

      importArr.length = 0;
      declareArr.length = 0;
    }
  });
};
moduleTemplate();

const mainModuleTemplate = () => {
  const map = {};
  for (let i = 1; i <= 100; i++) {
    map[`AppModules${i}Module`] = `app-modules${i}.module`;
  }

  const str = `
  import { NgModule } from '@angular/core';
  ${Object.keys(map)
    .map((key) => `import { ${key} } from './modules/${map[key]}';`)
    .join("\n")}
  
  @NgModule({
    imports: [${Object.keys(map).join(",\n")}]
  })
  export class MainModule {}
  `;
  fs.writeFileSync(path.resolve(__dirname, `src/app/main.module.ts`), str);
};
mainModuleTemplate();
