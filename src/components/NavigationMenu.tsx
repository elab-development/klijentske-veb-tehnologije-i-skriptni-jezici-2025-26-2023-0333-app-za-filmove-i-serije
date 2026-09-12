import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Clapperboard,
  Film,
  LogOut,
  Menu,
  UserRound,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/useAuth';

const navigationItems = [
  {
    label: 'Movies',
    to: '/',
    end: true,
    icon: Film,
  },
  {
    label: 'Profile',
    to: '/profile',
    icon: UserRound,
  },
  {
    label: 'Watchlist',
    to: '/watchlist',
    icon: Bookmark,
  },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-[#1f3e89] text-white shadow-lg shadow-[#1f3e89]/20'
      : 'text-[#7b8599] hover:bg-white hover:text-[#1f3e89]',
  ].join(' ');

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
    isActive
      ? 'bg-[#1f3e89] text-white'
      : 'text-[#081023] hover:bg-[#e8edf7] hover:text-[#1f3e89]',
  ].join(' ');

const NavigationMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const userInitial = currentUser?.name.charAt(0).toUpperCase() ?? 'M';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    toast.success('Uspešno ste se odjavili.');
    navigate('/login');
  };

  return (
    <>
      <header className='fixed left-0 right-0 top-0 z-50 border-b border-[#1f3e89]/10 bg-[#e8edf7]/90 text-[#081023] shadow-[0_10px_30px_rgba(8,16,35,0.08)] backdrop-blur-xl'>
        <div className='mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8'>
          <NavLink
            aria-label='Movies početna'
            className='flex min-w-0 items-center gap-3'
            end
            onClick={closeMobileMenu}
            to='/'
          >
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#081023] bg-[#1f3e89] text-white shadow-md shadow-[#1f3e89]/20'>
              <Clapperboard aria-hidden='true' className='h-5 w-5' />
            </span>
            <span className='truncate text-2xl font-extrabold tracking-normal'>
              Movies
            </span>
          </NavLink>

          <nav
            aria-label='Glavna navigacija'
            className='hidden items-center gap-2 md:flex'
          >
            {navigationItems.map(({ end, icon: Icon, label, to }) => (
              <NavLink className={navLinkClass} end={end} key={to} to={to}>
                <Icon aria-hidden='true' className='h-4 w-4' />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className='flex items-center gap-2'>
            <NavLink
              aria-label='Profile'
              className='hidden h-10 w-10 items-center justify-center rounded-full border border-[#1f3e89]/20 bg-white text-sm font-bold text-[#1f3e89] transition hover:border-[#1f3e89] md:flex'
              title={currentUser?.name ?? 'Profile'}
              to='/profile'
            >
              {userInitial}
            </NavLink>

            <button
              aria-label='Logout'
              className='hidden h-10 w-10 items-center justify-center rounded-full border border-[#081023]/10 bg-[#081023] text-white transition hover:bg-[#1f3e89] md:flex'
              onClick={handleLogout}
              title='Logout'
              type='button'
            >
              <LogOut aria-hidden='true' className='h-4 w-4' />
            </button>

            <button
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
              className='flex h-10 w-10 items-center justify-center rounded-full border border-[#081023]/10 bg-white text-[#081023] transition hover:border-[#1f3e89] hover:text-[#1f3e89] md:hidden'
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              type='button'
            >
              {isMobileMenuOpen ? (
                <X aria-hidden='true' className='h-5 w-5' />
              ) : (
                <Menu aria-hidden='true' className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <nav
          aria-label='Mobilna navigacija'
          className='fixed left-4 right-4 top-22 z-40 rounded-4xl border border-[#1f3e89]/10 bg-white p-3 shadow-2xl shadow-[#081023]/15 md:hidden'
        >
          {navigationItems.map(({ end, icon: Icon, label, to }) => (
            <NavLink
              className={mobileNavLinkClass}
              end={end}
              key={to}
              onClick={closeMobileMenu}
              to={to}
            >
              <Icon aria-hidden='true' className='h-5 w-5' />
              <span>{label}</span>
            </NavLink>
          ))}

          <button
            className='mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#081023] transition hover:bg-[#e8edf7] hover:text-[#1f3e89]'
            onClick={handleLogout}
            type='button'
          >
            <LogOut aria-hidden='true' className='h-5 w-5' />
            <span>Logout</span>
          </button>
        </nav>
      )}
    </>
  );
};

export default NavigationMenu;
