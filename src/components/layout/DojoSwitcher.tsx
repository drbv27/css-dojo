"use client";

import { useDojo, type DojoType } from "@/hooks/useDojo";

export default function DojoSwitcher() {
  const { activeDojo, setActiveDojo } = useDojo();

  const tabs: { key: DojoType; label: string; activeClass: string; icon: React.ReactNode }[] = [
    {
      key: "css",
      label: "CSS Dojo",
      activeClass: "bg-neon-blue/20 border-neon-blue text-neon-blue",
      icon: (
        <span className="font-mono font-bold text-xs">{"{ }"}</span>
      ),
    },
    {
      key: "js",
      label: "JS Dojo",
      activeClass: "bg-neon-yellow/20 border-neon-yellow text-neon-yellow",
      icon: (
        <span className="font-mono font-bold text-xs">JS</span>
      ),
    },
  ];

  return (
    <div className="flex w-full gap-1 px-3 py-2">
      {tabs.map((tab) => {
        const isActive = activeDojo === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveDojo(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
              isActive
                ? tab.activeClass
                : "border-transparent text-editor-muted hover:text-editor-text hover:bg-editor-hover"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
