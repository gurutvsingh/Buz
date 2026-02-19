const ModuleShell = ({ eyebrow, title, description, actions, children }) => (
  <section className="space-y-6 pb-10">
    {/* Header */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
            {eyebrow}
          </p>
        )}
        <h1 className="truncate text-xl font-black tracking-tight text-slate-900 lg:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>

    {/* Content — each child gets uniform gap via space-y-6 */}
    <div className="space-y-6">{children}</div>
  </section>
);

export default ModuleShell;