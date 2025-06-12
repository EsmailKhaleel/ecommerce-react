import ReactPaginate from 'react-paginate';
import { motion } from 'framer-motion';

function Pagination({ pageCount, onPageChange, currentPage }) {
  // Don't render pagination if there are no pages
  if (pageCount <= 0) return null;

  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(Math.max(0, currentPage), pageCount - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mt-8"
    >
      <ReactPaginate
        breakLabel="..."
        nextLabel={<span>Next <span aria-hidden="true">→</span></span>}
        previousLabel={<span><span aria-hidden="true">←</span> Previous</span>}
        onPageChange={onPageChange}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={validCurrentPage}
        renderOnZeroPageCount={null}
        className="flex gap-3 items-center"
        pageClassName="cursor-pointer transform transition-transform duration-200  border border-gray-300 dark:border-gray-700 rounded-md"
        pageLinkClassName="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center min-w-[40px] cursor-pointer"
        activeClassName="!bg-primary hover:!bg-primary/90 transform rounded-md transition-all duration-200 hover:bg-secondary"
        activeLinkClassName="!text-white font-medium"
        previousClassName="cursor-pointer transform transition-transform duration-200"
        nextClassName="cursor-pointer transform transition-transform duration-200"
        previousLinkClassName="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-200 flex items-center gap-1"
        nextLinkClassName="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-200 flex items-center gap-1"
        disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
        breakClassName="text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md"
        breakLinkClassName="cursor-default"
      />
    </motion.div>
  );
}

export default Pagination;
