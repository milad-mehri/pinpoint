"use client";

import Header from "@/components/Header";
import Link from "next/link";
import changelog from "@/data/changelog.json";

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8">Changelog</h1>
          
          <div className="space-y-12">
            {changelog.changes.map((change, index) => (
              <div key={change.date} className="relative">
                {/* Date line connector */}
                {index !== changelog.changes.length - 1 && (
                  <div className="absolute left-[7px] top-[30px] bottom-0 w-[2px] bg-gray-200" />
                )}
                
                {/* Date and content */}
                <div className="flex gap-6">
                  {/* Date circle */}
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-blue-600 mt-2" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      {new Date(change.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h2>
                    <ul className="space-y-3">
                      {change.updates.map((update, i) => {
                        // Check if the update contains a markdown link
                        const linkMatch = update.match(/\[(.*?)\]\((.*?)\)/);
                        if (linkMatch) {
                          const [fullMatch, text, url] = linkMatch;
                          const parts = update.split(fullMatch);
                          return (
                            <li key={i} className="text-gray-600">
                              {parts[0]}
                              <Link href={url} className="text-blue-600 hover:underline">
                                {text}
                              </Link>
                              {parts[1]}
                            </li>
                          );
                        }
                        return (
                          <li key={i} className="text-gray-600">
                            {update}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 