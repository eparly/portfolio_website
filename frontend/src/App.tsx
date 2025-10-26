import './styles.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from "./components/Layout/Layout"
import Home from './pages/home/HomePage';
import ProjectsPage from './pages/projects/ProjectsPage';
import NBAPages from './pages/nba/NBAPage';
import HockeyAnalyticsPage from './pages/hockey/HockeyAnalyticsPage';
import HomePage from './pages/recipes/HomePage/HomePage';
import RecipePage from './pages/recipes/RecipePage/RecipePage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AddRecipePage from './pages/recipes/AddRecipePage/AddRecipePage';
import NBAPicksPage from "./pages/nba/picks/NBAPicksPage";
import EVPicksPage from "./pages/nba/picks/EVPicksPage";

function App() {

  const cognitoAuthConfig = {
    authority: "https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_qJ4NNWARf",
    client_id: "6s6b90705i0dlaj36lilric729",
    // redirect_uri: "https://d13rcjctsw5fza.cloudfront.net",
    // redirect_uri: "http://localhost:3000/recipes",
    redirect_uri: "https://www.ethanparliament.com/recipes",
    response_type: "code",
    scope: "email openid phone profile",
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/nba/*" element={<NBAPages />} />
          <Route path="/nba/picks" element={<NBAPicksPage />} />
          <Route path="/nba/ev-picks" element={<EVPicksPage />} />
          <Route path="/hockey" element={<HockeyAnalyticsPage />} />
          <Route path="/recipes" element={<HomePage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route
          path="/add-recipe"
          element={
            <ProtectedRoute cognitoAuthConfig={cognitoAuthConfig}>
              <AddRecipePage />
            </ProtectedRoute>
          }
        />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
