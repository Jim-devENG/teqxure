import "server-only";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F8FAFC",
    padding: 64,
    fontFamily: "Helvetica",
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#1764FF",
    borderStyle: "solid",
    padding: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    color: "#1764FF",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    color: "#1B1F29",
    marginBottom: 24,
  },
  studentName: {
    fontSize: 24,
    color: "#1B1F29",
    marginBottom: 8,
  },
  body: {
    fontSize: 12,
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 1.6,
  },
  productName: {
    fontSize: 14,
    color: "#1B1F29",
    marginBottom: 32,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 32,
  },
  footerLabel: {
    fontSize: 9,
    color: "#4A5568",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footerValue: {
    fontSize: 11,
    color: "#1B1F29",
    marginTop: 4,
  },
});

interface CertificateData {
  studentName: string;
  bootcampTitle: string;
  cohortName: string;
  productName?: string | null;
  issuedAt: Date;
  verificationCode: string;
}

function CertificateDocument({ studentName, bootcampTitle, cohortName, productName, issuedAt, verificationCode }: CertificateData) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.eyebrow}>Teqxure — Certificate of Completion</Text>
          <Text style={styles.title}>{bootcampTitle}</Text>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.body}>
            has successfully completed the {bootcampTitle} ({cohortName}), building and shipping a real, production
            software product from problem statement to deployment.
          </Text>
          {productName && <Text style={styles.productName}>Product built: {productName}</Text>}
          <View style={styles.footerRow}>
            <View>
              <Text style={styles.footerLabel}>Issued</Text>
              <Text style={styles.footerValue}>{issuedAt.toLocaleDateString()}</Text>
            </View>
            <View>
              <Text style={styles.footerLabel}>Verification code</Text>
              <Text style={styles.footerValue}>{verificationCode}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderCertificatePdf(data: CertificateData): Promise<Buffer> {
  return renderToBuffer(<CertificateDocument {...data} />);
}
