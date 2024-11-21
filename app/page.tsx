import ProductCatalogBuilder from '@/components/product-catalog-builder';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <ProductCatalogBuilder />
      </div>
    </main>
  );
}