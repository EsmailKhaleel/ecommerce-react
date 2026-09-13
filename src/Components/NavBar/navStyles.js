export const mainNavItemsStyle = (isActive, isMobile = false) => {
  if (isActive) {
    return isMobile
      ? "bg-primary text-white rounded-lg"
      : "shop-nav-link shop-nav-link-active";
  }
  return isMobile
    ? "text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors duration-200 rounded-lg"
    : "shop-nav-link";
};
