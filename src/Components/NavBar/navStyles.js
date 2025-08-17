export const mainNavItemsStyle = (isActive, isMobile = false) => {
  if (isActive) {
    return isMobile
      ? "bg-primary text-white rounded-lg"
      : "bg-primary rounded-2xl text-white py-[5px] px-[15px] hover:bg-secondary";
  }
  return isMobile
    ? "text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors duration-200 rounded-lg"
    : 'inline-block px-4 hover:text-primary duration-200 before:content-[""] before:absolute before:w-0 before:bottom-[-2px] before:h-[2px] before:bg-primary before:transition-all before:duration-300 hover:before:w-full relative text-gray-700 dark:text-gray-200';
};
