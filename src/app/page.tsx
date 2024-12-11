import ChatInterface from '@/components/ChatInterface';
import JournalPage from '@/components/JournalPage';
import ResourcesPage from '@/components/ResourcesPage';
import SwipeableViews from '@/components/SwipeableViews';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="flex-grow">
        <SwipeableViews>
          <JournalPage />
          <ChatInterface />
          <ResourcesPage />
        </SwipeableViews>
      </div>
    </main>
  );
}
