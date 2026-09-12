import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoviesPaginationProps {
  disabled?: boolean;
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
}

const getVisiblePages = (page: number, totalPages: number) => {
  const pages = new Set<number>([1, totalPages]);

  for (let pageOffset = -1; pageOffset <= 1; pageOffset += 1) {
    const visiblePage = page + pageOffset;

    if (visiblePage > 1 && visiblePage < totalPages) {
      pages.add(visiblePage);
    }
  }

  return Array.from(pages).sort((firstPage, secondPage) => firstPage - secondPage);
};

const MoviesPagination = ({
  disabled = false,
  onPageChange,
  page,
  totalPages,
}: MoviesPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const safePage = Math.min(Math.max(page, 1), totalPages);
  const visiblePages = getVisiblePages(safePage, totalPages);

  return (
    <nav
      aria-label='Movies pagination'
      className='mt-8 flex flex-wrap items-center justify-center gap-2'
    >
      <button
        aria-label='Previous page'
        className='flex h-11 w-11 items-center justify-center rounded-full border border-[#1f3e89]/15 bg-white text-[#081023] transition hover:border-[#1f3e89] hover:text-[#1f3e89] disabled:cursor-not-allowed disabled:opacity-40'
        disabled={disabled || safePage === 1}
        onClick={() => onPageChange(safePage - 1)}
        type='button'
      >
        <ChevronLeft aria-hidden='true' className='h-5 w-5' />
      </button>

      {visiblePages.map((visiblePage, index) => {
        const previousPage = visiblePages[index - 1];
        const shouldShowGap = previousPage && visiblePage - previousPage > 1;

        return (
          <span className='flex items-center gap-2' key={visiblePage}>
            {shouldShowGap && (
              <span className='px-1 text-sm font-bold text-[#7b8599]'>...</span>
            )}
            <button
              aria-current={visiblePage === safePage ? 'page' : undefined}
              className={[
                'h-11 min-w-11 rounded-full px-4 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60',
                visiblePage === safePage
                  ? 'bg-[#1f3e89] text-white shadow-lg shadow-[#1f3e89]/20'
                  : 'border border-[#1f3e89]/15 bg-white text-[#081023] hover:border-[#1f3e89] hover:text-[#1f3e89]',
              ].join(' ')}
              disabled={disabled || visiblePage === safePage}
              onClick={() => onPageChange(visiblePage)}
              type='button'
            >
              {visiblePage}
            </button>
          </span>
        );
      })}

      <button
        aria-label='Next page'
        className='flex h-11 w-11 items-center justify-center rounded-full border border-[#1f3e89]/15 bg-white text-[#081023] transition hover:border-[#1f3e89] hover:text-[#1f3e89] disabled:cursor-not-allowed disabled:opacity-40'
        disabled={disabled || safePage === totalPages}
        onClick={() => onPageChange(safePage + 1)}
        type='button'
      >
        <ChevronRight aria-hidden='true' className='h-5 w-5' />
      </button>
    </nav>
  );
};

export default MoviesPagination;
