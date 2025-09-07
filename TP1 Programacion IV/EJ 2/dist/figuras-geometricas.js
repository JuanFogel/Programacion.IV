var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Clase abstracta FiguraGeometrica
var FiguraGeometrica = /** @class */ (function () {
    function FiguraGeometrica(nombre) {
        this.nombre = nombre;
    }
    // Método para obtener el nombre de la figura
    FiguraGeometrica.prototype.getNombre = function () {
        return this.nombre;
    };
    return FiguraGeometrica;
}());
// Clase Cuadrado que hereda de FiguraGeometrica
var Cuadrado = /** @class */ (function (_super) {
    __extends(Cuadrado, _super);
    function Cuadrado(nombre, lado) {
        var _this = _super.call(this, nombre) || this;
        _this.lado = lado;
        return _this;
    }
    Cuadrado.prototype.calcularArea = function () {
        return this.lado * this.lado; // Área = lado²
    };
    Cuadrado.prototype.getLado = function () {
        return this.lado;
    };
    return Cuadrado;
}(FiguraGeometrica));
// Clase Triangulo que hereda de FiguraGeometrica
var Triangulo = /** @class */ (function (_super) {
    __extends(Triangulo, _super);
    function Triangulo(nombre, base, altura) {
        var _this = _super.call(this, nombre) || this;
        _this.base = base;
        _this.altura = altura;
        return _this;
    }
    Triangulo.prototype.calcularArea = function () {
        return (this.base * this.altura) / 2; // Área = (base × altura) / 2
    };
    Triangulo.prototype.getBase = function () {
        return this.base;
    };
    Triangulo.prototype.getAltura = function () {
        return this.altura;
    };
    return Triangulo;
}(FiguraGeometrica));
// Clase Circulo que hereda de FiguraGeometrica
var Circulo = /** @class */ (function (_super) {
    __extends(Circulo, _super);
    function Circulo(nombre, radio) {
        var _this = _super.call(this, nombre) || this;
        _this.radio = radio;
        return _this;
    }
    Circulo.prototype.calcularArea = function () {
        return Math.PI * this.radio * this.radio; // Área = π × r²
    };
    Circulo.prototype.getRadio = function () {
        return this.radio;
    };
    return Circulo;
}(FiguraGeometrica));
// Ejemplo de uso
console.log("=== Ejercicio 2: Clase Abstracta ===");
// Crear instancias de cada figura
var cuadrado = new Cuadrado("Mi Cuadrado", 5);
var triangulo = new Triangulo("Mi Triángulo", 4, 6);
var circulo = new Circulo("Mi Círculo", 3);
// Calcular y mostrar las áreas
console.log("".concat(cuadrado.getNombre(), ": lado = ").concat(cuadrado.getLado(), ", \u00E1rea = ").concat(cuadrado.calcularArea()));
console.log("".concat(triangulo.getNombre(), ": base = ").concat(triangulo.getBase(), ", altura = ").concat(triangulo.getAltura(), ", \u00E1rea = ").concat(triangulo.calcularArea()));
console.log("".concat(circulo.getNombre(), ": radio = ").concat(circulo.getRadio(), ", \u00E1rea = ").concat(circulo.calcularArea().toFixed(2)));
// Demostrar polimorfismo
var figuras = [cuadrado, triangulo, circulo];
console.log("\n=== Usando polimorfismo ===");
figuras.forEach(function (figura) {
    console.log("El \u00E1rea de ".concat(figura.getNombre(), " es: ").concat(figura.calcularArea().toFixed(2)));
});
