import { Layout, ToastStack } from './components/Layout';
import { useRoute } from './components/router';
import { GameProvider } from './game/GameContext';
import { Dashboard } from './pages/Dashboard';
import { ModulePage } from './pages/ModulePage';
import { ClinicPage, ExamPage, LabPage, ProfilePage } from './pages/OtherPages';

function Routes({ route }: { route: string[] }) {
  switch (route[0]) {
    case 'modul':
      return <ModulePage key={route[1]} moduleId={route[1] ?? ''} tab={route[2]} />;
    case 'klinik':
      return <ClinicPage scenarioId={route[1]} />;
    case 'labor':
      return <LabPage simulatorId={route[1]} />;
    case 'pruefung':
      return <ExamPage />;
    case 'profil':
      return <ProfilePage />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  const route = useRoute();
  return (
    <GameProvider>
      <Layout route={route}>
        <Routes route={route} />
      </Layout>
      <ToastStack />
    </GameProvider>
  );
}
