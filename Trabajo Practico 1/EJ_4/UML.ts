interface Volar {
  Volar(): string;
}
abstract class Animal {
    protected _nombre: string="";
    public constructor(nombre: string) {
        this._nombre=nombre;
     }
     get nombre() { return this._nombre; } set nombre(v: string) { this._nombre = v; }
    public abstract hacerSonio(): void;
   }
class Pajaro extends Animal implements Volar{
    private especie: string;
    public constructor(_nombre: string,  _especie : string) {
        super(_nombre);
        this.especie=_especie;
     }
     public override hacerSonio(): void { console.log("Pio pio") }
     public Volar(): string{
        return `El ave ${this.especie}, llamada ${this.nombre}, vuela al poderoso grito de :`;
    }
   }

class Zorro extends Animal {    
    private especie: string;
    public constructor(_nombre: string,  _especie : string) {
        super(_nombre);
        this.especie=_especie;
     }
    public override hacerSonio(): void { console.log("Auuu") }
    
   }
const juan=new Pajaro("Juan", "Hornero");
console.log(juan.Volar());
console.log(juan.hacerSonio());