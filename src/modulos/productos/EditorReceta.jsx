import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { productosApi } from './api'
import { ayudaReceta, componentesAPeticion, tituloReceta } from './receta'
import TablaReceta from './TablaReceta'

export default function EditorReceta({ producto, editable }) {
  const consultas = useQueryClient()
  const receta = useQuery({ queryKey: ['receta', producto.codigo], queryFn: () => productosApi.receta(producto.codigo) })

  if (receta.isPending) {
    return <Cargando />
  }
  return <Contenido key={receta.dataUpdatedAt} producto={producto} receta={receta.data} editable={editable} consultas={consultas} />
}

function Contenido({ producto, receta, editable, consultas }) {
  const [filas, setFilas] = useState(receta.componentes)
  const [rinde, setRinde] = useState(1)
  const guardar = useMutation({
    mutationFn: () => productosApi.guardarReceta(producto.codigo, componentesAPeticion(filas, rinde)),
    onSuccess: (datos) => {
      consultas.setQueryData(['receta', producto.codigo], datos)
      consultas.invalidateQueries({ queryKey: ['recetas'] })
    },
  })

  return (
    <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
      <div>
        <p className="font-semibold">{tituloReceta(producto.tipo)}</p>
        <p className="text-xs text-suave">{ayudaReceta(producto.tipo)}</p>
      </div>
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}
      {guardar.isSuccess && <Alerta tipo="exito">Receta guardada.</Alerta>}
      {receta.bloqueada && editable && (
        <Alerta tipo="info">Esta receta ya se usó en ventas: al guardar cambios se crea una versión nueva y las ventas anteriores no cambian.</Alerta>
      )}
      <TablaReceta filas={filas} onCambiar={setFilas} editable={editable} excluir={producto.codigo} rinde={rinde} onRinde={setRinde} />
      {editable && (
        <div className="border-t border-borde pt-3">
          <Boton icono="bi-check-lg" cargando={guardar.isPending} disabled={filas.length === 0} onClick={() => guardar.mutate()}>
            Guardar receta
          </Boton>
        </div>
      )}
    </section>
  )
}
