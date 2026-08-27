
const buttonVariants = {
  'gold-glow': `
    bg-gradient-to-r from-[#C9A227] to-[#E8C97A]
    text-obsidian-900 font-semibold tracking-widest uppercase text-xs
    px-8 py-4 rounded-full
    shadow-[0_0_20px_rgba(201,162,39,0.4)]
    hover:shadow-[0_0_36px_rgba(201,162,39,0.6)]
    hover:scale-[1.03] active:scale-[0.98]
    transition-all duration-300
  `,
  'glass': `
    glass-dark text-ivory-50 font-medium
    px-6 py-3 rounded-full
    border border-ivory-50/20
    hover:border-gold-300/40 hover:text-gold-300
    transition-all duration-300
  `,
  'outline-gold': `
    border border-gold-500 text-gold-500 font-medium
    px-6 py-3 rounded-full
    hover:bg-gold-500 hover:text-obsidian-900
    transition-all duration-300
  `,
};

const Button = ({ variant = 'gold-glow', className = '', children, as: Component = 'button', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = buttonVariants[variant] || buttonVariants['gold-glow'];
  
  return (
    <Component className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Button;
