from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

ARCHIVO = "productos.json"


def cargar_productos():
    if os.path.exists(ARCHIVO):
        with open(ARCHIVO, "r", encoding="utf-8") as archivo:
            return json.load(archivo)
    return {}


def guardar_productos(productos):
    with open(ARCHIVO, "w", encoding="utf-8") as archivo:
        json.dump(productos, archivo, indent=4, ensure_ascii=False)


@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/productos", methods=["GET"])
def obtener_productos():
    productos = cargar_productos()
    return jsonify(productos)


@app.route("/agregar", methods=["POST"])
def agregar_producto():
    datos = request.json
    nombre = datos["nombre"].lower().strip()
    precio = float(datos["precio"])

    productos = cargar_productos()
    productos[nombre] = precio
    guardar_productos(productos)

    return jsonify({"mensaje": "Producto guardado correctamente"})


@app.route("/cambiar_precio", methods=["POST"])
def cambiar_precio():
    datos = request.json
    nombre = datos["nombre"].lower().strip()
    precio = float(datos["precio"])

    productos = cargar_productos()

    if nombre not in productos:
        return jsonify({"error": "El producto no existe"}), 404

    productos[nombre] = precio
    guardar_productos(productos)

    return jsonify({"mensaje": "Precio actualizado"})


@app.route("/eliminar", methods=["POST"])
def eliminar_producto():
    datos = request.json
    nombre = datos["nombre"].lower().strip()

    productos = cargar_productos()

    if nombre not in productos:
        return jsonify({"error": "El producto no existe"}), 404

    del productos[nombre]
    guardar_productos(productos)

    return jsonify({"mensaje": "Producto eliminado"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
