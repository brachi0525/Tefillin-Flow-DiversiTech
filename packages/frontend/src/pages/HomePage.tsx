import AdminDashboardPage from "./adminDashboard/AdminDashboardPage";


interface HomePageProps {
    
}

const HomePage = ({ ...prop }: HomePageProps) => {
  return (
    <>
      <AdminDashboardPage />
    </>
  );
};

export default HomePage;