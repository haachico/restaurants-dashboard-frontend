import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <header className="fixed w-full z-10 bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-3xl font-bold text-[#000] dark:text-white">DineDash</h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              setTheme((prev) => (prev === "light" ? "dark" : "light"));
            }}
            className="ml-4 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;