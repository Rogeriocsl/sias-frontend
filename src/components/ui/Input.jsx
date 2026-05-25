export function Input({ label, error, ...props }) {
    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && <label className="text-xs font-bold text-text-muted uppercase tracking-tight">{label}</label>}
            <input
                className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-text-body transition-all focus:outline-none placeholder:text-text-muted/40
                    ${
                        error
                            ? "border-error focus:border-error focus:ring-2 focus:ring-error-border"
                            : "border-border focus:border-brand focus:ring-2 focus:ring-brand/10"
                    }`}
                {...props}
            />
            {error && <span className="text-xs text-error font-medium mt-0.5 flex items-center gap-1">⚠️ {error}</span>}
        </div>
    );
}
