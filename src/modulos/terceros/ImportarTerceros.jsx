import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { RUTA_API } from '../../api/cliente'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Titulo from '../../components/ui/Titulo'
import { tercerosApi } from './api'

export default function ImportarTerceros() {
  const consultas = useQueryClient()
  const [archivo, setArchivo] = useState(null)
  const importar = useMutation({
    mutationFn: tercerosApi.importar,
    onSuccess: () => consultas.invalidateQueries({ queryKey: ['terceros'] }),
  })
  const resultado = importar.data

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Titulo>Cargue muchos clientes o proveedores a la vez desde un archivo de Excel</Titulo>
      <Link to="/terceros" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>

      <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
        <p className="font-semibold">1. Descargue la plantilla</p>
        <p className="text-sm text-suave">
          Llénela con una fila por cliente o proveedor. Si alguien ya está registrado, solo se le agrega el rol que le falte.
        </p>
        <a
          href={RUTA_API + '/terceros/plantilla'}
          className="flex items-center gap-2 self-start border border-borde px-3 py-2 text-sm hover:bg-superficie-alt"
        >
          <i className="bi bi-file-earmark-spreadsheet text-marca" />
          Descargar plantilla
        </a>
      </section>

      <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
        <p className="font-semibold">2. Suba el archivo</p>
        <input
          type="file"
          accept=".xlsx"
          onChange={(evento) => setArchivo(evento.target.files[0] || null)}
          className="text-sm file:mr-3 file:border file:border-borde file:bg-superficie-alt file:px-3 file:py-2 file:text-sm"
        />
        <Boton icono="bi-upload" className="self-start" disabled={!archivo} cargando={importar.isPending} onClick={() => importar.mutate(archivo)}>
          Importar
        </Boton>
        {importar.isError && <Alerta>{importar.error.message}</Alerta>}
      </section>

      {resultado && (
        <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
          <Alerta tipo="exito">
            Se crearon {resultado.creados} y se actualizaron {resultado.actualizados}.
            {resultado.errores.length > 0 && ' ' + resultado.errores.length + ' filas no se importaron.'}
          </Alerta>
          {resultado.errores.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-superficie-alt text-left text-suave">
                <tr>
                  <th className="px-3 py-2 font-medium">Fila</th>
                  <th className="px-3 py-2 font-medium">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {resultado.errores.map((error) => (
                  <tr key={error.fila}>
                    <td className="px-3 py-2">{error.fila}</td>
                    <td className="px-3 py-2">{error.mensaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  )
}
