
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div style={{ textAlign: 'center', marginTop: '4rem' }}>
    <h2>אין לך הרשאה לצפות בדף זה</h2>
    <p>אנא פנה למנהל המערכת או התחבר עם משתמש מתאים.</p>
    <Link to="/">חזרה לדף הבית</Link>
  </div>
);

export default Unauthorized;