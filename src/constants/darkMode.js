export const darkModeColors = {
  background: "dark:bg-gray-900",
  backgroundSecondary: "dark:bg-gray-800",
  backgroundTertiary: "dark:bg-gray-700",
  
  card: "dark:bg-gray-800",
  cardHeader: "dark:bg-gray-800",
  cardBody: "dark:bg-gray-800",
  
  border: "dark:border-gray-700",
  borderLight: "dark:border-gray-600",
  
  text: "dark:text-white",
  textSecondary: "dark:text-gray-300",
  textTertiary: "dark:text-gray-400",
  
  hover: "dark:hover:bg-gray-700",
  hoverLight: "dark:hover:bg-gray-800/50",
  
  tableRow: "dark:bg-gray-800",
  tableRowHover: "dark:hover:bg-gray-700",
  tableRowEven: "dark:bg-gray-800/50",
  
  dialog: "dark:bg-gray-900",
  dialogHeader: "dark:bg-gray-800",
  dialogBody: "dark:bg-gray-800",
  dialogFooter: "dark:bg-gray-800",
  
  input: "dark:bg-gray-800",
  inputBorder: "dark:border-gray-700",
  inputPlaceholder: "dark:placeholder-gray-400",
  
  menu: "dark:bg-gray-800",
  menuItem: "dark:hover:bg-gray-700",
  menuBorder: "dark:border-gray-700",
};

/**
 * Dark mode class-larını birləşdirmək üçün helper funksiya
 * @param {...string} classes - Birləşdiriləcək class-lar
 * @returns {string} Birləşdirilmiş class string
 */
export const combineDarkClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

