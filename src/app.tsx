import { useEffect } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Sections } from './components/Sections';
import { CommitAndResetSection } from './components/Sections/CommitAndResetSection/CommitAndResetSection';
import { ConfigSection } from './components/Sections/ConfigSection';
import { ThemeProvider } from './components/ThemeProvider';
import { useQRScoutState } from './store/store';

import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';
import { runStatsigAutoCapture } from '@statsig/web-analytics';
import { FloatingFormValue } from './components/FloatingFormValue';

function MainContent() {
  const { pageTitle } = useQRScoutState(state => ({
    pageTitle: state.formData.page_title,
  }));

  return (
    <div className="min-h-screen py-2">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="font-sans text-6xl font-bold">
          <div className="font-racing text-primary flex items-center">{pageTitle}</div>
        </h1>
        <FloatingFormValue />
            <form className="w-full px-4" onSubmit={e => e.preventDefault()}>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                <Sections />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <ConfigSection />
                <CommitAndResetSection />
              </div>
            </form>
      </main>
      <Footer />
    </div>
  );
}

function AppWithStatsig() {
  const { teamNumber } = useQRScoutState(state => ({
    teamNumber: state.formData.teamNumber,
  }));

  const statsigKey = import.meta.env.VITE_STATSIG_CLIENT_KEY;
  const { client } = useClientAsyncInit(statsigKey, {
    userID: `${teamNumber}`,
  });

  useEffect(() => {
    if (client) {
      runStatsigAutoCapture(client);
    }
  }, [client]);

  return (
    <StatsigProvider client={client} loadingComponent={<div>Loading...</div>}>
      <ThemeProvider>
        <MainContent />
      </ThemeProvider>
    </StatsigProvider>
  );
}

function AppWithoutStatsig() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}

export function App() {
  const statsigKey = import.meta.env.VITE_STATSIG_CLIENT_KEY;
  const shouldUseStatsig = Boolean(statsigKey);

  if (!shouldUseStatsig) {
    return <AppWithoutStatsig />;
  }

  return <AppWithStatsig />;
}
