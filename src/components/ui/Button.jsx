export function Button({ children, variant = "primary", className = "", ...props }) {
    const baseStyle =
        "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 active:scale-[0.98]";

    const variants = {
        primary: "bg-brand text-brand-text shadow-sm hover:bg-accent-mid hover:scale-[1.02] hover:shadow-brand/20",

        secondary: "bg-accent text-white shadow-sm hover:opacity-90 hover:scale-[1.02] hover:shadow-accent/20",

        danger: "bg-error text-white hover:bg-red-700",

        outline: "border border-border text-text-strong bg-transparent hover:bg-background/50",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
