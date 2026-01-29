import * as React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    loading?: boolean;
};

function Button({
    children,
    className,
    variant = 'primary',
    loading = false,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;
    return (
        <button
            disabled={isDisabled}
            className={clsx(
                "px-6 py-2 border-2 font-semibold rounded-xl transition-all duration-500 ease-in-out",

                {
                    "bg-accent hover:bg-[#7abe1a] hover:rounded-full border-accent text-background":
                        variant === 'primary'
                },

                className
            )}
            {...props}

        >{/* Spinner */}
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Spinner />
                </span>
            )}

            {/* Content */}
            <span className={loading ? "opacity-0" : "opacity-100"}>
                {children}
            </span>
        </button>
    )
}

function Spinner() {
    return (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    );
}

export default Button