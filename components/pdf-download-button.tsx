"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { CatalogSettings, Product } from "./product-catalog-builder/types";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    height: "100%",
  },
  header: {
    width: "100%",
    height: "20%",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    padding: 20,
    height: "60%",
  },
  productsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  productCard: {
    width: "31%",
    height: 180,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  productCardTwoColumns: {
    width: "48%",
  },
  productImageContainer: {
    width: "100%",
    height: 100,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  productTitle: {
    fontSize: 12,
    marginBottom: 4,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 10,
    color: "#666666",
    textDecoration: "line-through",
    marginBottom: 2,
  },
  discountPrice: {
    fontSize: 14,
    color: "#ff0000",
    fontWeight: "bold",
  },
  footer: {
    width: "100%",
    height: "20%",
    position: "absolute",
    bottom: 0,
  },
  footerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

interface PDFDownloadButtonProps {
  products: Product[];
  settings: CatalogSettings;
}

const CatalogPDFDocument = ({ products, settings }: PDFDownloadButtonProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {settings.header.logo && (
          <Image src={settings.header.logo} style={styles.headerImage} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.productsGrid}>
          {products.map((product, index) => (
            <View
              key={index}
              style={[
                styles.productCard,
                ...(settings.gridColumns === 2
                  ? [styles.productCardTwoColumns]
                  : []),
              ]}
            >
              <View style={styles.productImageContainer}>
                {product.image && (
                  <Image src={product.image} style={styles.productImage} />
                )}
              </View>
              <Text style={styles.productTitle}>{product.title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>
                  {product.originalPrice}
                </Text>
                <Text style={styles.discountPrice}>
                  {product.discountPrice}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {settings.footer.logo && (
          <Image src={settings.footer.logo} style={styles.footerImage} />
        )}
      </View>
    </Page>
  </Document>
);

export function PDFDownloadButton({
  products,
  settings,
}: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const blob = await pdf(
        <CatalogPDFDocument products={products} settings={settings} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "catalogo.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} size="lg">
      {loading ? (
        "Gerando PDF..."
      ) : (
        <>
          <FileDown className="w-4 h-4 mr-2" />
          Baixar PDF
        </>
      )}
    </Button>
  );
}
