/**
 * Returns an array of menu items, each containing an id, name, and link.
 * 
 * @param {function} t - The translation function from the i18next library.
 * @returns {Array} An array of objects, each containing an id, name, and link.
 */
const getMenuItems = (t) => [
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
    name: t("navigation.addProduct", "Add Product"),
    link: "/addProduct",
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
];

export default getMenuItems;
