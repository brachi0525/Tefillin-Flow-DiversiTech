import React from 'react';
const NoAccessPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>אין לך הרשאה</h1>
      <p>הגישה לעמוד זה מוגבלת למשתמשים מורשים בלבד.</p>
      <a href="/login">חזרה להתחברות </a>
    </div>
  );
};
export default NoAccessPage;