
'use client';

import { useTransition } from '@/context/transition-context';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  ...rest
}) => {
  const { startTransition } = useTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.toString() === pathname) {
        e.preventDefault();
        return;
    }
    startTransition();
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

export default TransitionLink;
