'use client';

import { motion } from 'framer-motion';

export default function ResourcesPage() {
  return (
    <div className="w-full h-full flex flex-col px-4 py-6">
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col -mb-4">
        <div className="flex-grow relative bg-transparent rounded-2xl overflow-hidden shadow-lg">
          <div className="relative h-full overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Resources</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Helpful resources and exercises for your mental well-being.
                Coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
