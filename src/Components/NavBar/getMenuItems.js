/**
 * Returns an array of menu items, each containing an id, name, and link.
 * 
 * @param {function} t - The translation function from the i18next library.
 * @returns {Array} An array of objects, each containing an id, name, and link.
 */
const getMenuItems = (t, user) => [
  {
    id: 1,
    name: t("navigation.explore"),
    link: "/",
  },
  {
    id: 2,
    name: t("navigation.products"),
    link: "/products",
  },
  {
    id: 3,
    name: "Dashboard",
    link: "/admin",
    adminOnly: true,
  },
  {
    id: 4,
    name: t("navigation.wishlist"),
    link: "/wishlist",
  },
  {
    id: 5,
    name: t("navigation.account"),
    link: "/account",
  },
].filter(item => !item.adminOnly || ['owner', 'admin'].includes(user?.role));

export default getMenuItems;
