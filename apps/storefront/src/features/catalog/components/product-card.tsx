import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

export type ProductCardProps = {
  href: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageSizes?: string;
  title: string;
  subtitle?: string;
};

export const ProductCard: FC<ProductCardProps> = ({
  href,
  imageUrl,
  imageWidth,
  imageHeight,
  imageSizes,
  title,
  subtitle,
}) => (
  <Link href={href} className="card bg-base-300 shadow-lg">
    {imageUrl && (
      <figure>
        <Image
          src={imageUrl}
          alt={title}
          width={imageWidth}
          height={imageHeight}
          sizes={imageSizes}
        />
      </figure>
    )}
    <div className="card-body">
      <h3 className="card-title">{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
  </Link>
);
