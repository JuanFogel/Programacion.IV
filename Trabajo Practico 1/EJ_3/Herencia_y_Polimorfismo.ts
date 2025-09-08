abstract class Empleado {
     constructor(private _nombre: string = "", private _salarioBase: number = 0) {}
     get nombre() { return this._nombre; } set nombre(v: string) { this._nombre = v; }
     get salarioBase() { return this._salarioBase; } set salarioBase(v: number) { this._salarioBase = v; }
     abstract calcularSalario(): number;
   }
class EmpleadoTiempoCompleto extends Empleado {
    constructor(_nombre: string ="",  _salarioBase : number = 0) {
        super(_nombre,_salarioBase);
     }
     override calcularSalario(): number { return this.salarioBase + 20000;; }
   }

class EmpleadoMedioTiempo extends Empleado {
    constructor(_nombre: string ="",  _salarioBase : number = 0) {
        super(_nombre,_salarioBase);
     }
     override calcularSalario(): number { return this.salarioBase/2;; }
   }


   
const empleados: Empleado[] = [
  new EmpleadoTiempoCompleto("Juan", 50000),
  new EmpleadoMedioTiempo("Ana", 30000),
  new EmpleadoTiempoCompleto("Pedro", 60000),
  new EmpleadoMedioTiempo("Laura", 40000),
];

for (const emp of empleados) {
  console.log(`El salario de ${emp.nombre} es: ${emp.calcularSalario()}`);
}
