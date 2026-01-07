import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * 统一的面包屑导航组件 - 移动端优化
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-xs md:text-sm text-text-tertiary mb-3 md:mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2 overflow-x-auto">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            {index > 0 && <span className="text-border-default">/</span>}
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-primary transition-colors duration-200 flex items-center"
              >
                {item.icon && (
                  <span className="mr-0.5 md:mr-1">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-text-primary font-medium line-clamp-1 flex items-center">
                {item.icon && (
                  <span className="mr-0.5 md:mr-1">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
