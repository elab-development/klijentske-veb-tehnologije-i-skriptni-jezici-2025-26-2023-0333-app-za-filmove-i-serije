import { Bookmark, CheckCircle2, Mail, UserRound } from 'lucide-react';

import { useAuth } from '../contexts/useAuth';
import { useMovieLibrary } from '../hooks/useMovieLibrary';

const Profile = () => {
  const { currentUser } = useAuth();
  const { library } = useMovieLibrary(currentUser?.id);
  const userInitial = currentUser?.name.charAt(0).toUpperCase() ?? 'M';

  return (
    <main className='mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center px-5 py-10 sm:px-8'>
      <section className='w-full'>
        <div className='max-w-xl'>
          <p className='text-sm font-bold uppercase tracking-[0.18em] text-[#1f3e89]'>
            Profile
          </p>
          <h1 className='mt-3 text-4xl font-extrabold leading-tight text-[#081023] sm:text-5xl'>
            Welcome back, {currentUser?.name}
          </h1>
          <p className='mt-4 max-w-lg text-base font-medium leading-7 text-[#7b8599]'>
            Manage your movie profile and keep your watchlist tied to your
            account.
          </p>
        </div>

        <div className='mt-9 grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]'>
          <div className='flex min-h-52 flex-col justify-between rounded-4xl border border-[#1f3e89]/10 bg-white p-5 shadow-xl shadow-[#081023]/5'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#081023] bg-[#1f3e89] text-4xl font-extrabold text-white shadow-lg shadow-[#1f3e89]/20'>
              {userInitial}
            </div>
            <div>
              <p className='text-2xl font-extrabold text-[#081023]'>
                {currentUser?.name}
              </p>
              <p className='mt-1 text-sm font-semibold text-[#7b8599]'>
                Movie member
              </p>
            </div>
          </div>

          <div className='rounded-4xl border border-[#1f3e89]/10 bg-white p-5 shadow-xl shadow-[#081023]/5 sm:p-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-3xl bg-[#e8edf7] p-5'>
                <UserRound
                  aria-hidden='true'
                  className='mb-4 h-6 w-6 text-[#1f3e89]'
                />
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#7b8599]'>
                  Name
                </p>
                <p className='mt-2 text-lg font-extrabold text-[#081023]'>
                  {currentUser?.name}
                </p>
              </div>

              <div className='rounded-3xl bg-[#e8edf7] p-5'>
                <Mail
                  aria-hidden='true'
                  className='mb-4 h-6 w-6 text-[#1f3e89]'
                />
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#7b8599]'>
                  Email
                </p>
                <p className='mt-2 wrap-break-word text-lg font-extrabold text-[#081023]'>
                  {currentUser?.email}
                </p>
              </div>

              <div className='rounded-3xl bg-[#e8edf7] p-5'>
                <Bookmark
                  aria-hidden='true'
                  className='mb-4 h-6 w-6 text-[#1f3e89]'
                />
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#7b8599]'>
                  Saved
                </p>
                <p className='mt-2 text-3xl font-extrabold text-[#081023]'>
                  {library.watchlist.length}
                </p>
              </div>

              <div className='rounded-3xl bg-[#e8edf7] p-5'>
                <CheckCircle2
                  aria-hidden='true'
                  className='mb-4 h-6 w-6 text-[#0f766e]'
                />
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#7b8599]'>
                  Watched
                </p>
                <p className='mt-2 text-3xl font-extrabold text-[#081023]'>
                  {library.watched.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
