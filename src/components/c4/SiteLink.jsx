import { forwardRef } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import { siteTo } from '@/lib/sitePath';

/*
 * react-router's Link and NavLink, pointed at the address the server actually
 * serves (see src/lib/sitePath.js). Import Link from here, not from
 * react-router-dom, for any internal link a crawler might follow.
 */
export const Link = forwardRef(function SiteLink({ to, ...rest }, ref) {
  return <RouterLink ref={ref} to={siteTo(to)} {...rest} />;
});

export const NavLink = forwardRef(function SiteNavLink({ to, ...rest }, ref) {
  return <RouterNavLink ref={ref} to={siteTo(to)} {...rest} />;
});
