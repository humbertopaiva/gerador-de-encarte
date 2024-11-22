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

// Tamanho do A4 (em pontos)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;

// Alturas fixas para Header, Footer e Content
const HEADER_HEIGHT = A4_HEIGHT * 0.15; // 15%
const FOOTER_HEIGHT = A4_HEIGHT * 0.1; // 10%
const CONTENT_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT; // Restante (~632pt)

// Padding interno para o conteúdo dos produtos
const CONTENT_PADDING = 12; // Padding para o container de produtos

// Margens e espaçamento
const GAP = 8; // Espaçamento entre os produtos

// Função para calcular dimensões dos cards
const calculateCardDimensions = (columns: number, rows: number) => {
  const cardWidth =
    (A4_WIDTH - CONTENT_PADDING * 2 - (columns - 1) * GAP) / columns;
  const cardHeight =
    (CONTENT_HEIGHT - CONTENT_PADDING * 2 - (rows - 1) * GAP) / rows;
  return { cardWidth, cardHeight };
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    width: A4_WIDTH,
    height: A4_HEIGHT,
    flexDirection: "column",
  },
  header: {
    height: HEADER_HEIGHT,
    width: "100%",
    // marginBottom: GAP,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    height: CONTENT_HEIGHT,
    padding: CONTENT_PADDING, // Padding apenas no conteúdo
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  footer: {
    height: FOOTER_HEIGHT,
    width: "100%",
    // marginTop: GAP,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginBottom: GAP,
  },
  productImageWrapper: {
    width: "100%",
    height: "70%", // 70% da altura do card reservado para a imagem
    marginBottom: 8,
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 2,
  },
  productTitle: {
    fontSize: 10,
    textAlign: "left",
    marginBottom: 4,
    lineHeight: 1.4, // Permite até 2 linhas
    maxWidth: "100%", // Limita o título à largura do card
    overflow: "hidden", // Garante que o texto não ultrapasse
    wordWrap: "break-word", // Faz a quebra de linha no texto longo
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  originalPrice: {
    fontSize: 10,
    textDecoration: "line-through",
    color: "#666666",
  },
  discountPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF3B30", // Cor de exemplo
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
    const generatePDF = async () => {
      try {
        const [columns, rows] = settings.layout
          .split("x")
          .map((n) => parseInt(n, 10)); // Extrai colunas e linhas do layout
        const productsPerPage = columns * rows; // Produtos por página
        const visibleProducts = products.slice(0, productsPerPage); // Filtra os produtos visíveis

        const { cardWidth, cardHeight } = calculateCardDimensions(
          columns,
          rows
        );

        const PDFDocument = () => (
          <Document>
            <Page size="A4" style={styles.page}>
              {/* Header */}
              <View style={styles.header}>
                <Image src={settings.header.logo} style={styles.headerImage} />
              </View>

              {/* Content */}
              <View style={styles.content}>
                {visibleProducts.map((product, index) => (
                  <View
                    key={index}
                    style={[
                      styles.productCard,
                      {
                        width: cardWidth,
                        height: cardHeight,
                      },
                    ]}
                  >
                    <View style={styles.productImageWrapper}>
                      {product.image && (
                        <Image
                          src={product.image}
                          style={styles.productImage}
                        />
                      )}
                    </View>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <View style={styles.priceContainer}>
                      {product.originalPrice && (
                        <Text style={styles.originalPrice}>
                          R$ {product.originalPrice}
                        </Text>
                      )}
                      <Text
                        style={[
                          styles.discountPrice,
                          { color: settings.primaryColor },
                        ]}
                      >
                        R$ {product.discountPrice}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Footer */}
              <View
                style={[
                  styles.footer,
                  { backgroundColor: settings.footer.backgroundColor },
                ]}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  {settings.footer.website || "Footer Information"}
                </Text>
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
