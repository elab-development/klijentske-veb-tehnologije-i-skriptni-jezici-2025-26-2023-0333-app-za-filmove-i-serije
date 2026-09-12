import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Clapperboard, LockKeyhole, UserRound } from 'lucide-react';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate replace to='/' />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Unesite email i lozinku.');
      return;
    }

    const loggedInUser = login(email, password);

    if (!loggedInUser) {
      toast.error('Korisnik sa unetim podacima ne postoji.');
      return;
    }

    toast.success(`Dobrodošli, ${loggedInUser.name}!`);
    navigate('/');
  };

  const handleUnavailableAction = (label: string) => {
    toast.info(`${label} ekran je u pripremi.`);
  };

  return (
    <main className='relative min-h-screen overflow-hidden bg-[#e8edf7] text-[#081023]'>
      <div className='absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#7f8cac] sm:-left-28 sm:-top-36 sm:h-96 sm:w-96 lg:-left-44 lg:-top-48 lg:h-165 lg:w-165' />
      <div className='absolute -bottom-28 -right-28 hidden h-80 w-80 rounded-full border-42 border-[#1f3e89]/10 xl:block' />

      <div className='relative z-10 grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(480px,620px)]'>
        <section className='relative hidden min-h-screen items-center justify-center px-12 py-12 lg:flex'>
          <div className='relative h-140 w-full max-w-140'>
            <div className='absolute left-8 top-20 h-72 w-52 rotate-[-10deg] rounded-4xl border border-white/35 bg-[#081023] p-4 shadow-2xl shadow-[#081023]/30'>
              <div className='flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-[#172753]'>
                <div className='grid grid-cols-5 gap-1 border-b border-white/10 bg-[#e8edf7]/10 p-3'>
                  {Array.from({ length: 15 }).map((_, index) => (
                    <span
                      className='h-5 rounded-sm border border-white/15'
                      key={index}
                    />
                  ))}
                </div>
                <div className='flex flex-1 flex-col justify-end bg-linear-to-br from-[#1f3e89] via-[#6f7fa3] to-[#081023] p-5'>
                  <Clapperboard
                    aria-hidden='true'
                    className='mb-5 h-12 w-12 text-white'
                    strokeWidth={1.7}
                  />
                  <div className='h-3 w-28 rounded-full bg-white/80' />
                  <div className='mt-3 h-2 w-36 rounded-full bg-white/35' />
                </div>
              </div>
            </div>

            <div className='absolute bottom-16 right-6 h-80 w-56 rotate-[8deg] rounded-4xl border border-white/50 bg-white/35 p-4 shadow-2xl shadow-[#1f3e89]/20 backdrop-blur'>
              <div className='flex h-full flex-col rounded-[1.35rem] border border-[#1f3e89]/15 bg-[#f5f7fc] p-4'>
                <div className='mb-4 flex items-center gap-2'>
                  <span className='h-3 w-3 rounded-full bg-[#1f3e89]' />
                  <span className='h-2 w-20 rounded-full bg-[#7f8cac]' />
                </div>
                <div className='grid flex-1 grid-cols-2 gap-3'>
                  {[
                    'bg-[#1f3e89]',
                    'bg-[#7f8cac]',
                    'bg-[#081023]',
                    'bg-white',
                  ].map((color, index) => (
                    <span
                      className={`rounded-xl border border-[#1f3e89]/10 ${color}`}
                      key={`${color}-${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='flex min-h-screen items-center justify-center px-8 py-12 sm:px-12 lg:px-16'>
          <form
            className='mt-24 w-full max-w-77.5 sm:mt-20 sm:max-w-95 lg:mt-0'
            onSubmit={handleSubmit}
          >
            <div className='mb-16 text-center sm:mb-14'>
              <h1 className='text-[38px] font-semibold leading-none tracking-normal text-black sm:text-5xl lg:text-[56px]'>
                Login
              </h1>
              <p className='mt-4 text-sm font-medium text-[#7b8599] sm:text-base'>
                Don&apos;t have an account?{' '}
                <button
                  className='font-bold text-[#1f3e89] transition hover:text-[#081023] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3e89]/30'
                  onClick={() => handleUnavailableAction('Sign up')}
                  type='button'
                >
                  sign up
                </button>
              </p>
            </div>

            <div className='space-y-11 sm:space-y-10'>
              <label className='block' htmlFor='login-email'>
                <span className='relative block border-b-2 border-[#1f3e89]'>
                  <input
                    className='peer h-10 w-full bg-transparent pr-11 text-[25px] font-medium text-[#081023] outline-none placeholder:text-[#7b8599] sm:h-12 sm:text-[28px]'
                    id='login-email'
                    name='email'
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='email'
                    type='email'
                    value={email}
                  />
                  <UserRound
                    aria-hidden='true'
                    className='pointer-events-none absolute bottom-1.5 right-0 h-7 w-7 text-black transition peer-focus:text-[#1f3e89] sm:h-8 sm:w-8'
                    strokeWidth={1.7}
                  />
                </span>
              </label>

              <label className='block' htmlFor='login-password'>
                <span className='relative block border-b-2 border-[#1f3e89]'>
                  <input
                    className='peer h-10 w-full bg-transparent pr-11 text-[25px] font-medium text-[#081023] outline-none placeholder:text-[#7b8599] sm:h-12 sm:text-[28px]'
                    id='login-password'
                    name='password'
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder='password'
                    type='password'
                    value={password}
                  />
                  <LockKeyhole
                    aria-hidden='true'
                    className='pointer-events-none absolute bottom-1.5 right-0 h-7 w-7 text-black transition peer-focus:text-[#1f3e89] sm:h-8 sm:w-8'
                    strokeWidth={1.7}
                  />
                </span>
                <button
                  className='mt-1.5 block text-sm font-medium text-[#1f3e89] transition hover:text-[#081023] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3e89]/30 sm:text-base'
                  onClick={() => handleUnavailableAction('Forgot password')}
                  type='button'
                >
                  forgot password?
                </button>
              </label>
            </div>

            <button
              className='mx-auto mt-17 flex h-13.5 min-w-41.5 items-center justify-center rounded-full border-2 border-[#081023] bg-[#294a99] px-10 text-[28px] font-extrabold leading-none text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1f3e89] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1f3e89]/20 sm:mt-16 sm:h-16 sm:min-w-52.5 sm:text-[34px]'
              type='submit'
            >
              Login
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
