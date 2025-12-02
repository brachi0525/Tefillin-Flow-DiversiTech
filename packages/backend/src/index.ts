import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
}
else {
  dotenv.config();
}
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});