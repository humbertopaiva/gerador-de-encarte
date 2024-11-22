"use client";

export default function Home() {
  return import("react").then((React) => {
    const { Suspense } = React;
    const ProductCatalogBuilder = React.lazy(
      () => import("@/components/product-catalog-builder")
    );

    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 items-center flex justify-center">
        <Suspense fallback={<div>Carregando...</div>}>
          <ProductCatalogBuilder />
        </Suspense>
      </main>
    );
  });
}
