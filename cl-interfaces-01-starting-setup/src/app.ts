class Department {
  // public name: string;
  private employees: string[] = [];

  constructor(private id: string, public name: string) {
    // this.name = n;
  }

  // 独自関数の作成
  describe(this: Department) {
    console.log("id: " + this.id + "Department:" + this.name);
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInfomation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

// 継承
class ITDepartment extends Department {
  constructor(id: string) {
    // 親: Department のconstructor が呼ばれる
    super(id, "IT");
  }
}

const it = new ITDepartment("d2");
// 親元の継承した値だから以下のようなエラーが出る。（id は親元で private 設定）
// Property 'id' is private and only accessible within class 'Department'.
it.id = "sss";

const accounting = new Department("d1", "Accounting");

accounting.addEmployee("Kouhei");
accounting.addEmployee("Fujii");

// Property 'employees' is private and only accessible within class 'Department'.ts
// private の修飾子がついていると関数を通してしかアクセスできない
// NG
// accounting.employees[2] = "other";
// OK
accounting.addEmployee("other");

// public ならアクセス可能
accounting.name = "New Name";

accounting.describe();
accounting.printEmployeeInfomation();
