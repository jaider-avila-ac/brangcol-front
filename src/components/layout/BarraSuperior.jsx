export default function BarraSuperior({ onMenu }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 bg-marca px-4 text-white">
      <button
        type="button"
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center hover:bg-marca-oscuro md:hidden"
        aria-label="Abrir menú"
      >
        <i className="bi bi-list text-2xl" />
      </button>
      <span className="text-lg font-semibold tracking-wide">BrangCol</span>
      <div className="ml-auto flex items-center gap-2 text-sm">
        <i className="bi bi-person-circle text-xl" />
        <span className="hidden sm:inline">Usuario</span>
      </div>
    </header>
  )
}
