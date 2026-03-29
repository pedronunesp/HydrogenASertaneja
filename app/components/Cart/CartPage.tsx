import {Analytics} from '@shopify/hydrogen';
import clsx from 'clsx';
import type {CartLine as CartLineType} from '@shopify/hydrogen/storefront-api-types';

import {useCart, useGlobal, useSettings} from '~/hooks';

import {CartEmpty} from './CartEmpty';
import {CartLine} from './CartLine';
import {CartTotals} from './CartTotals';
import {CartUpsell} from './CartUpsell/CartUpsell';
import {FreeShippingMeter} from './FreeShippingMeter';

export function CartPage() {
  const {cart: cartSettings} = useSettings();
  const {isCartReady} = useGlobal();
  const cart = useCart();
  const {lines = [], totalQuantity = 0} = cart;
  const cartLines = lines as CartLineType[];
  const heading = cartSettings?.heading ?? 'My Cart';
  const hasCartLines = totalQuantity > 0;

  return (
    <section
      className="md:px-contained py-contained"
      data-comp={CartPage.displayName}
    >
      <div className="mx-auto max-w-screen-xl">
        <h1 className="text-h2 mb-4 px-4 md:px-0">{heading || 'My Cart'}</h1>

        <div
          className={clsx(
            hasCartLines
              ? 'md:grid md:grid-cols-[3fr_2fr] md:grid-rows-[auto_1fr] md:gap-x-4 md:gap-y-4'
              : '',
          )}
        >
          {hasCartLines && (
            /*
             * Summary panel — first in DOM so it renders at the top on mobile.
             * On desktop, grid placement (col 2, row 1) moves it to the right column.
             */
            <div className="flex flex-col gap-0 border-b border-b-border md:col-start-2 md:row-start-1 md:gap-3 md:border-b-0">
              <div className="[&>div]:md:rounded [&>div]:md:border [&>div]:md:border-border">
                <FreeShippingMeter settings={cartSettings} />
              </div>

              <div className="[&>div]:border-t-0 [&>div]:md:rounded [&>div]:md:border [&>div]:md:border-border [&>div]:md:border-t">
                <CartTotals settings={cartSettings} />
              </div>
            </div>
          )}

          {/* Cart items — left column on desktop, below summary on mobile */}
          <div
            className={clsx(
              hasCartLines
                ? 'md:col-start-1 md:row-start-1 md:row-span-2'
                : '',
            )}
          >
            <ul
              className={clsx(
                'relative border-y border-border',
                !hasCartLines && 'min-h-80 py-12 md:min-h-[30rem]',
              )}
            >
              {hasCartLines ? (
                cartLines.map((line) => (
                  <li
                    key={line.id}
                    className="border-b border-b-border last:border-none"
                  >
                    <CartLine line={line} />
                  </li>
                ))
              ) : (
                <CartEmpty settings={cartSettings} />
              )}
            </ul>
          </div>

          {hasCartLines && (
            /* Upsell — right column second row on desktop, below items on mobile */
            <div className="md:col-start-2 md:row-start-2 [&>div]:border-border [&>div]:md:rounded [&>div]:md:border">
              <CartUpsell settings={cartSettings} />
            </div>
          )}
        </div>
      </div>

      {isCartReady && <Analytics.CartView customData={{cart}} />}
    </section>
  );
}

CartPage.displayName = 'CartPage';
