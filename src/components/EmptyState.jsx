export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
      {Icon && (
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/20 text-gold-500">
          <Icon size={26} />
        </div>
      )}
      <p className="font-semibold text-slate-900">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}