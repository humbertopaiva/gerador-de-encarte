"use client";

import { useEffect } from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { CatalogSettings, Product } from "./product-catalog-builder/types";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f1f1f1",
    flexDirection: "column",
    display: "flex",
  },
  header: {
    height: "20%",
    width: "100%",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: "20 30",
    height: "70%",
    flex: 1,
  },
  //   productsGrid: {
  //     display: "flex",
  //     flexDirection: "row",
  //     flexWrap: "wrap",
  //     justifyContent: "space-between",
  //   },
  //   productCard: {
  //     width: "31%",
  //     marginBottom: 20,
  //     backgroundColor: "#ffffff",
  //     padding: 12,
  //   },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  productCard: {
    width: "31%",
    marginBottom: 8, // Espaço vertical reduzido
    marginRight: 8, // Espaço horizontal reduzido
    backgroundColor: "#ffffff",

    padding: 8, // Padding interno menor
  },
  productImageWrapper: {
    width: "100%",
    position: "relative",
    marginBottom: 12,
  },
  productImageContainer: {
    width: "100%",
    paddingTop: "75%",
    backgroundColor: "#ffffff",

    position: "relative",
    overflow: "hidden",
  },
  productImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
  },
  productImageContent: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  productTitle: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "left",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
  originalPrice: {
    fontSize: 10,
    textDecoration: "line-through",
    color: "#666666",
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    height: "10%",
    padding: "10 30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  footerContact: {
    color: "#ffffff",
    fontSize: 10,
  },
  footerSocial: {
    flexDirection: "row",
    gap: 10,
  },
  footerRight: {
    width: 80,
    height: 80,
  },
});

interface PDFRendererProps {
  products: Product[];
  settings: CatalogSettings;
  onComplete: () => void;
}

export default function PDFRenderer({
  products,
  settings,
  onComplete,
}: PDFRendererProps) {
  useEffect(() => {
    console.log("DATA", products, settings);
    const generatePDF = async () => {
      try {
        const PDFDocument = () => (
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.header}>
                <Image src={settings.header.logo} style={styles.headerImage} />
              </View>

              <View style={styles.content}>
                <View style={styles.productsGrid}>
                  {products.map((product, index) => (
                    <View key={index} style={styles.productCard}>
                      <View style={styles.productImageWrapper}>
                        <View style={styles.productImageContainer}>
                          {product.image && (
                            <View style={styles.productImage}>
                              <Image
                                src={product.image}
                                style={styles.productImageContent}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                      <Text style={styles.productTitle}>{product.title}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.originalPrice}>
                          {product.originalPrice}
                        </Text>
                        <Text
                          style={[
                            styles.discountPrice,
                            { color: settings.primaryColor },
                          ]}
                        >
                          {product.discountPrice}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={[
                  styles.footer,
                  { backgroundColor: settings.footer.backgroundColor },
                ]}
              >
                <View style={styles.footerLeft}>
                  {settings.footer.whatsapp && (
                    <Text style={styles.footerContact}>
                      WhatsApp: {settings.footer.whatsapp}
                    </Text>
                  )}
                  <View style={styles.footerSocial}>
                    {settings.footer.instagram && (
                      <Text style={styles.footerContact}>Instagram</Text>
                    )}
                    {settings.footer.facebook && (
                      <Text style={styles.footerContact}>Facebook</Text>
                    )}
                    {settings.footer.tiktok && (
                      <Text style={styles.footerContact}>TikTok</Text>
                    )}
                  </View>
                  {settings.footer.address && (
                    <Text style={styles.footerContact}>
                      {settings.footer.address}
                    </Text>
                  )}
                  {settings.footer.website && (
                    <Text style={styles.footerContact}>
                      {settings.footer.website}
                    </Text>
                  )}
                </View>
                {settings.footer.qrCodeLink && (
                  <View style={styles.footerRight}>
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        settings.footer.qrCodeLink
                      )}`}
                    />
                  </View>
                )}
              </View>
            </Page>
          </Document>
        );

        const blob = await pdf(<PDFDocument />).toBlob();
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
        onComplete();
      }
    };

    generatePDF();
  }, [products, settings, onComplete]);

  return null;
}
