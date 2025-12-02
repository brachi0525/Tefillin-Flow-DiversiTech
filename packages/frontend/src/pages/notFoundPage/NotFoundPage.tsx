import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { FloatingElement, GradientOrb, NotFoundActions, NotFoundButton, NotFoundContainer, NotFoundContent, NotFoundDescription, NotFoundIllustration, NotFoundSecondaryButton, NotFoundSubtitle, NotFoundTitle, NotFoundWrapper } from './NotFoundPage.styles';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <NotFoundWrapper>
       <GradientOrb className="orb-1" />
      <GradientOrb className="orb-2" />
      <GradientOrb className="orb-3" />
      <NotFoundContainer>
        <NotFoundIllustration>
          <FloatingElement className="float-1">404</FloatingElement>
        </NotFoundIllustration>

        <NotFoundContent>
          <NotFoundTitle role="heading" aria-level={1}>הדף לא נמצא</NotFoundTitle>
          <NotFoundSubtitle>אופס! נראה שהגעת למקום שלא קיים</NotFoundSubtitle>
          <NotFoundDescription>
            הדף שחיפשת אולי הועבר, נמחק או שהכתובת שגויה
            <br />
            בואו ננסה למצוא את מה שאתה מחפש יחד
          </NotFoundDescription>

          <NotFoundActions>
            <NotFoundButton
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              חזרה לעמוד הבית
            </NotFoundButton>
            <NotFoundSecondaryButton
              variant="outlined"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              רענן דף
            </NotFoundSecondaryButton>
          </NotFoundActions>
        </NotFoundContent>
      </NotFoundContainer>
    </NotFoundWrapper>
  );
};

export default NotFoundPage;
