// Clase abstracta FiguraGeometrica
abstract class FiguraGeometrica {
    protected nombre: string;

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    // Método abstracto que debe ser implementado por las clases hijas
    abstract calcularArea(): number;

    // Método para obtener el nombre de la figura
    getNombre(): string {
        return this.nombre;
    }
}

// Clase Cuadrado que hereda de FiguraGeometrica
class Cuadrado extends FiguraGeometrica {
    private lado: number;

    constructor(nombre: string, lado: number) {
        super(nombre);
        this.lado = lado;
    }

    calcularArea(): number {
        return this.lado * this.lado; // Área = lado²
    }

    getLado(): number {
        return this.lado;
    }
}

// Clase Triangulo que hereda de FiguraGeometrica
class Triangulo extends FiguraGeometrica {
    private base: number;
    private altura: number;

    constructor(nombre: string, base: number, altura: number) {
        super(nombre);
        this.base = base;
        this.altura = altura;
    }

    calcularArea(): number {
        return (this.base * this.altura) / 2; // Área = (base × altura) / 2
    }

    getBase(): number {
        return this.base;
    }

    getAltura(): number {
        return this.altura;
    }
}

// Clase Circulo que hereda de FiguraGeometrica
class Circulo extends FiguraGeometrica {
    private radio: number;

    constructor(nombre: string, radio: number) {
        super(nombre);
        this.radio = radio;
    }

    calcularArea(): number {
        return Math.PI * this.radio * this.radio; // Área = π × r²
    }

    getRadio(): number {
        return this.radio;
    }
}

// Ejemplo de uso
console.log("=== Ejercicio 2: Clase Abstracta ===");

// Crear instancias de cada figura
const cuadrado = new Cuadrado("Mi Cuadrado", 5);
const triangulo = new Triangulo("Mi Triángulo", 4, 6);
const circulo = new Circulo("Mi Círculo", 3);

// Calcular y mostrar las áreas
console.log(`${cuadrado.getNombre()}: lado = ${cuadrado.getLado()}, área = ${cuadrado.calcularArea()}`);
console.log(`${triangulo.getNombre()}: base = ${triangulo.getBase()}, altura = ${triangulo.getAltura()}, área = ${triangulo.calcularArea()}`);
console.log(`${circulo.getNombre()}: radio = ${circulo.getRadio()}, área = ${circulo.calcularArea().toFixed(2)}`);

// Demostrar polimorfismo
const figuras: FiguraGeometrica[] = [cuadrado, triangulo, circulo];

console.log("\n=== Usando polimorfismo ===");
figuras.forEach(figura => {
    console.log(`El área de ${figura.getNombre()} es: ${figura.calcularArea().toFixed(2)}`);
});
