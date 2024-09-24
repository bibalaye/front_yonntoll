import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Ici, vous pouvez ajouter la logique pour sauvegarder ce paramètre
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
    // Ici, vous pouvez ajouter la logique pour sauvegarder ce paramètre et appliquer le mode sombre
  };

  return (
    <div>
      <h2>Paramètres</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleNotificationToggle}
          />
          Activer les notifications
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={darkModeEnabled}
            onChange={handleDarkModeToggle}
          />
          Mode sombre
        </label>
      </div>
    </div>
  );
};

export default Settings;