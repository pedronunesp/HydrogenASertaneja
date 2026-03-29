import {useMemo} from 'react';
import {useLocation} from 'react-router';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import {useCustomer, useCustomerLogOut, useSettings} from '~/hooks';

export function CustomerAccountLayout({children}: {children: React.ReactNode}) {
  const {pathname} = useLocation();
  const customer = useCustomer();
  const {customerLogOut} = useCustomerLogOut();
  const {account} = useSettings();

  const {helpHeading, helpItems, menuItems} = {...account?.menu};

  const activeMenuItem = useMemo(() => {
    return menuItems?.find(({link}) => {
      return pathname.startsWith(link?.url);
    });
  }, [pathname, menuItems]);

  return (
    <section
      className="px-contained py-contained"
      data-comp={CustomerAccountLayout.displayName}
    >
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-6 md:grid-cols-[12rem_1fr] lg:grid-cols-[16rem_1fr]">
        <div>
          {/* Greeting — compact on mobile, white background */}
          <div className="flex items-center justify-between gap-4 border-b border-b-border pb-3 md:flex-col md:items-start md:gap-2 md:pb-6">
            <div>
              <h2 className="break-words text-base font-bold md:text-h5 lg:text-h4">
                {customer?.firstName ? `Olá, ${customer.firstName}` : 'Minha Conta'}
              </h2>
              <p className="hidden break-words text-xs text-neutralMedium md:block">
                {customer?.emailAddress?.emailAddress}
              </p>
            </div>

            <button
              aria-label="Sign out"
              className="shrink-0 text-xs text-neutralMedium underline underline-offset-2 transition md:hover:text-text"
              onClick={customerLogOut}
              type="button"
            >
              Sair
            </button>
          </div>

          {/* Mobile: horizontal shortcut pills — shown immediately */}
          <nav className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-3 md:hidden">
            {menuItems?.map(({link}, index) => {
              const isActive = activeMenuItem?.link?.url === link?.url;
              return link?.text ? (
                <Link
                  key={index}
                  aria-label={link.text}
                  className={clsx(
                    'whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition',
                    isActive
                      ? 'border-text bg-text text-background'
                      : 'border-border bg-background text-text',
                  )}
                  newTab={link.newTab}
                  to={link.url}
                  type={link.type}
                >
                  {link.text}
                </Link>
              ) : null;
            })}
          </nav>

          {/* Desktop nav */}
          <nav className="hidden border-b border-b-border py-6 md:block">
            <ul className="flex flex-col items-start md:gap-4 lg:gap-6">
              {menuItems?.map(({link}, index) => {
                return link?.text ? (
                  <li key={index}>
                    <Link
                      aria-label={link.text}
                      to={link.url}
                      newTab={link.newTab}
                      type={link.type}
                    >
                      <p className="text-h5 md:text-h4 lg:text-h3 hover-text-underline">
                        {link.text}
                      </p>
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </nav>

          {/* Help section — desktop only */}
          <div className="flex flex-col gap-2 py-6 max-md:hidden">
            <h3 className="text-base font-normal">{helpHeading}</h3>

            <ul className="flex flex-col items-start">
              {helpItems?.map(({link}, index) => {
                return link?.text ? (
                  <li key={index}>
                    <Link
                      aria-label={link.text}
                      className="break-words text-xs"
                      to={link.url}
                      type={link.type}
                    >
                      {link.text}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

CustomerAccountLayout.displayName = 'AccountLayout.Customer';
