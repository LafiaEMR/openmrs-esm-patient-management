import React, { useMemo } from 'react';
import classNames from 'classnames';
import { ConfigurableLink } from '@openmrs/esm-framework';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './createDashboardLink.scss';

export interface DashboardLinkConfig {
  name: string;
  title: string;
}

// TODO: extract this out into the esm-framework and all 4 copies of this file in this repo?

function DashboardExtension({ dashboardLinkConfig }: { dashboardLinkConfig: DashboardLinkConfig }) {
  //
  const { t } = useTranslation();
  const { name, title } = dashboardLinkConfig;
  const location = useLocation();
  const spaBasePath = `${window.spaBase}/home`;

  const navLink = useMemo(() => {
    const pathArray = location.pathname.split('/home');
    const lastElement = pathArray[pathArray.length - 1];
    return decodeURIComponent(lastElement);
  }, [location.pathname]);

  return (
    <ConfigurableLink
      className={`cds--side-nav__link ${navLink.match(name) ? styles.activeLeftNavLink : ''}`}
      to={`${spaBasePath}/${name}`}>
      <span className={navLink.match(name) ? styles.activeTitle : styles.inactiveTitle}>{t(name)}</span>
    </ConfigurableLink>
  );
}

export const createDashboardLink = (dashboardLinkConfig: DashboardLinkConfig) => () => (
  <BrowserRouter>
    <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
  </BrowserRouter>
);
