export interface Product {
  id: number;
  image: string;
  title: string;
  originalPrice: string;
  discountPrice: string;
}

export interface CatalogSettings {
  header: {
    title: string;
    subtitle: string;
    logo: string;
  };
  footer: {
    text: string;
    logo: string;
  };
  imageShape: "square" | "circle";
  gridColumns: number;
}