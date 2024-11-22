// types.ts
export interface Product {
  id: number;
  image: string;
  title: string;
  originalPrice: string;
  discountPrice: string;
}

export interface FooterSettings {
  backgroundColor: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
  address?: string;
  qrCodeLink?: string;
}

export interface CatalogSettings {
  header: {
    logo: string;
  };
  layout: "4x3" | "3x3" | "4x2";
  footer: FooterSettings;
  primaryColor: string;
  imageShape: "square" | "circle";
}
