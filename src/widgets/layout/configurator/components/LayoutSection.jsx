import React from "react";
import { useTranslation } from "react-i18next";
import { ConfiguratorSection } from "./ConfiguratorSection";
import { ConfiguratorSwitch } from "./ConfiguratorSwitch";

export function LayoutSection({ isOpen, onToggle }) {
  const { t } = useTranslation();

  const layoutIcon = (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
    </svg>
  );

  const compactModeIcon = (
    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );

  const rtlModeIcon = (
    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );

  return (
    <ConfiguratorSection
      title={t("configurator.sections.layout.title")}
      icon={layoutIcon}
      iconColor="from-amber-500 to-amber-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <ConfiguratorSwitch
        id="layout-compact"
        titleKey="configurator.sections.layout.compactMode.title"
        descriptionKey="configurator.sections.layout.compactMode.description"
        checked={false}
        onChange={() => {}}
        icon={compactModeIcon}
        iconBgColor="bg-gray-100 dark:bg-gray-700"
        iconColor="text-gray-400 dark:text-gray-500"
        disabled={true}
        opacity={true}
      />

      <ConfiguratorSwitch
        id="layout-rtl"
        titleKey="configurator.sections.layout.rtlMode.title"
        descriptionKey="configurator.sections.layout.rtlMode.description"
        checked={false}
        onChange={() => {}}
        icon={rtlModeIcon}
        iconBgColor="bg-gray-100 dark:bg-gray-700"
        iconColor="text-gray-400 dark:text-gray-500"
        disabled={true}
        opacity={true}
      />
    </ConfiguratorSection>
  );
}

