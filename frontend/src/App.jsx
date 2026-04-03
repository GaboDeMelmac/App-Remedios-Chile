import { useMemo, useState } from "react";
import { medicamentos } from "./data/medicamentos";
import "./styles.css";

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [comunaSeleccionada, setComunaSeleccionada] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState("asc");

  const comunas = useMemo(() => {
    return [...new Set(medicamentos.map((item) => item.comuna))].sort();
  }, []);

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    let filtrados = medicamentos.filter((item) => {
      const coincideTexto =
        item.nombre_producto.toLowerCase().includes(texto) ||
        item.principio_activo.toLowerCase().includes(texto);

      const coincideComuna =
        comunaSeleccionada === "" || item.comuna === comunaSeleccionada;

      return coincideTexto && coincideComuna;
    });

    filtrados.sort((a, b) => {
      return ordenPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio;
    });

    return filtrados;
  }, [busqueda, comunaSeleccionada, ordenPrecio]);

  const precioMinimo =
    resultados.length > 0
      ? Math.min(...resultados.map((item) => item.precio))
      : null;

  return (
    <div className="app">
      <header className="hero">
        <h1>Buscador de remedios</h1>
        <p>Compara precios por comuna y farmacia en Chile</p>
      </header>

      <section className="filtros">
        <input
          type="text"
          placeholder="Buscar por producto o principio activo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={comunaSeleccionada}
          onChange={(e) => setComunaSeleccionada(e.target.value)}
        >
          <option value="">Todas las comunas</option>
          {comunas.map((comuna) => (
            <option key={comuna} value={comuna}>
              {comuna}
            </option>
          ))}
        </select>

        <select
          value={ordenPrecio}
          onChange={(e) => setOrdenPrecio(e.target.value)}
        >
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </section>

      <section className="resumen">
        <p>
          <strong>{resultados.length}</strong> resultado(s)
        </p>
      </section>

      <section className="grid">
        {resultados.length === 0 ? (
          <div className="sin-resultados">
            No se encontraron medicamentos con esos filtros.
          </div>
        ) : (
          resultados.map((item) => {
            const esMasBarato = item.precio === precioMinimo;

            return (
              <article
                key={item.id}
                className={`card ${esMasBarato ? "card-destacada" : ""}`}
              >
                {esMasBarato && <span className="badge">Mejor precio</span>}

                <h2>{item.nombre_producto}</h2>

                <p>
                  <strong>Principio activo:</strong> {item.principio_activo}
                </p>
                <p>
                  <strong>Dosis:</strong> {item.dosis_mg} mg
                </p>
                <p>
                  <strong>Farmacia:</strong> {item.farmacia}
                </p>
                <p>
                  <strong>Comuna:</strong> {item.comuna}
                </p>
                <p className="precio">${item.precio.toLocaleString("es-CL")}</p>
                <p>
                  <strong>Fecha:</strong> {item.fecha_precio}
                </p>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
