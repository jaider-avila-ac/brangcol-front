export default function PantallaPublica({ titulo, subtitulo, children }) {
  return (
    <div className="flex min-h-full bg-fondo">
      <div className="hidden w-[42%] flex-col justify-between bg-lateral p-10 text-sobre-lateral lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-acento text-xl font-black text-sobre-acento">B</span>
          <span className="text-2xl font-bold tracking-wide">BrangCol</span>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-3xl leading-tight font-semibold">Las ventas de su negocio, fáciles de llevar.</p>
          <div className="h-1 w-16 bg-acento" />
          <p className="text-lateral-suave">Venda, cobre y revise su inventario desde cualquier equipo.</p>
        </div>
        <p className="text-xs text-lateral-suave">BrandingCol</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md border border-borde bg-superficie">
          <div className="border-b-4 border-acento bg-marca px-6 py-5 text-sobre-marca">
            <h1 className="text-xl font-semibold">{titulo}</h1>
            {subtitulo && <p className="text-sm">{subtitulo}</p>}
          </div>
          <div className="flex flex-col gap-4 p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
