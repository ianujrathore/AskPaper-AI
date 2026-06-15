function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'btn'
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }
  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }
  
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button