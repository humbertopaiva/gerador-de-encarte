"use client";

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register Inter font for PDF
Font.register({
  family: "Inter",
  src: "https://rsms.me/inter/font-files/Inter-Regular.woff2",
});

Font.register({
  family: "Inter-Bold",
  src: "https://rsms.me/inter/font-files/Inter-Bold.woff2",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  headerLogo: {
    width: 200,
    height: 80,
    objectFit: "contain",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#1a365d",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#4a5568",
    textAlign: "center",
  },
  productsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    marginBottom: 12,
    borderRadius: 8,
  },
  productImageCircle: {
    borderRadius: 100,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 6,
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: "Inter",
    textDecoration: "line-through",
    color: "#64748b",
  },
  discountPrice: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#2563eb",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 10,
    fontFamily: "Inter",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 12,
  },
  footerLogo: {
    width: 120,
    height: 48,
    objectFit: "contain",
    alignSelf: "center",
  },
});

interface CatalogPDFProps {
  products: Array<{
    image: string;
    title: string;
    originalPrice: string;
    discountPrice: string;
  }>;
  settings: {
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
  };
}

export default function CatalogPDF({ products, settings }: CatalogPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {settings.header.logo && (
            // eslint-disable-next-line
            <Image
              src={settings.header.logo}
              style={{ objectFit: "contain", marginBottom: 15 }}
            />
          )}
          <Text style={styles.headerTitle}>{settings.header.title}</Text>
          <Text style={styles.headerSubtitle}>{settings.header.subtitle}</Text>
        </View>

        <View style={styles.productsGrid}>
          {products.map((product, index) => (
            <View key={index} style={styles.productCard}>
              {product.image && (
                // eslint-disable-next-line
                <Image src={product.image} style={[styles.productImage]} />
              )}
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>{settings.footer.text}</Text>
          {settings.footer.logo && (
            // eslint-disable-next-line
            <Image src={settings.footer.logo} style={styles.footerLogo} />
          )}
        </View>
      </Page>
    </Document>
  );
}
