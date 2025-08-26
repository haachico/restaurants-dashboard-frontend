import { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';

function ThemeToggler() {
  const [theme, setTheme] = useState('light');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(theme === 'dark');
  }, [theme]);

  const handleChange = (event) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <label>
      <span className='text-gray-700 dark:text-gray-200'>Toggle Theme</span>
      <Switch
        checked={checked}
        onChange={handleChange}
        color="default" // Customize colors as needed
      />
    </label>
  );
}

export default ThemeToggler;