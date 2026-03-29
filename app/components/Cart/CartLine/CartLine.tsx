import {memo, useMemo} from 'react';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {QuantitySelector} from '~/components/QuantitySelector';
import {Svg} from '~/components/Svg';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';

import type {CartLineProps} from '../Cart.types';

import {useCartLine} from './useCartLine';
import {useCartLineImage} from './useCartLineImage';
import {useCartLinePrices} from './useCartLinePrices';

export const CartLine = memo(({closeCart, line}: CartLineProps) => {
  const {discountAllocations, merchandise} = line;

  const {handleDecrement, handleIncrement, handleRemove, optimisticQuantity} =
    useCartLine({line});

  const {price, compareAtPrice} = useCartLinePrices({line});

  const image = useCartLineImage({line});

  const url = useMemo(() => {
    const searchParams = new URLSearchParams();
    merchandise.selectedOptions.forEach(({name, value}) => {
      searchParams.set(name, value);
    });
    return `/products/${merchandise.product.handle}?${searchParams}`;
  }, [merchandise.id]);

  return optimisticQuantity > 0 ? (
    <div className="grid grid-cols-[auto_1fr] gap-3 p-4">
      <Link
        aria-label={`View ${merchandise.product.title}`}
        to={url}
        onClick={closeCart}
        tabIndex={-1}
      >
        <Image
          data={{
            ...image,
            altText: merchandise.product.title,
          }}
          aspectRatio={
            image?.width && image?.height
              ? `${image.width}/${image.height}`
              : PRODUCT_IMAGE_ASPECT_RATIO
          }
          width="100px"
          className="bg-neutralLightest"
        />
      </Link>

      <div className="flex min-h-[6.25rem] flex-col justify-between gap-2">
        {/* Title row + remove */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <Link
              aria-label={`View ${merchandise.product.title}`}
              to={url}
              onClick={closeCart}
            >
              <h3 className="text-h6 leading-snug">{merchandise.product.title}</h3>
            </Link>

            {merchandise.title !== 'Default Title' && (
              <p className="text-xs text-neutralMedium">{merchandise.title}</p>
            )}
          </div>

          {/* Remove button — larger touch target */}
          <button
            aria-label={`Remove ${merchandise.product.title} from cart`}
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutralMedium transition md:hover:bg-neutralLightest md:hover:text-text"
            onClick={handleRemove}
            type="button"
          >
            <Svg
              className="w-3"
              src="/svgs/close.svg#close"
              title="Close"
              viewBox="0 0 24 24"
            />
          </button>
        </div>

        {/* Quantity + price row */}
        <div className="flex items-end justify-between gap-3">
          <QuantitySelector
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            productTitle={merchandise.product.title}
            quantity={optimisticQuantity}
          />

          <div className="flex flex-col items-end gap-0.5">
            {/* Applicable cart line discounts */}
            {discountAllocations?.length > 0 &&
              discountAllocations.map(
                (discount: {title?: string; code?: string}, index) => {
                  if (!discount.title && !discount.code) return null;
                  return (
                    <div key={index} className="flex items-center gap-1">
                      {discount.code && (
                        <Svg
                          className="w-3"
                          src="/svgs/discount.svg#discount"
                          title="Discount"
                          viewBox="0 0 24 24"
                        />
                      )}
                      <p className="text-xs text-neutralMedium">
                        {discount.title || discount.code}
                      </p>
                    </div>
                  );
                },
              )}

            <div className="flex flex-wrap items-baseline justify-end gap-x-1.5">
              {compareAtPrice && (
                <p className="text-xs text-neutralMedium line-through">
                  {compareAtPrice}
                </p>
              )}
              <p className="text-sm font-semibold">{price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
});

CartLine.displayName = 'CartLine';
