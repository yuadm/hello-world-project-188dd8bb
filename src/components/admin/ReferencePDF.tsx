import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #003078",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003078",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: "#505a5f",
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#003078",
    marginBottom: 8,
    paddingBottom: 3,
    borderBottom: "1 solid #b1b4b6",
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 9,
    color: "#505a5f",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: "#0b0c0c",
  },
  card: {
    backgroundColor: "#f3f2f1",
    padding: 10,
    marginBottom: 8,
    borderRadius: 3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#505a5f",
    borderTop: "1 solid #b1b4b6",
    paddingTop: 10,
  },
});

interface ReferenceData {
  confirmedRelationship: string;
  knownForYears: string;
  characterDescription: string;
  isReliable: string;
  reliableComments?: string;
  isPatient: string;
  patientComments?: string;
  hasGoodJudgment: string;
  judgmentComments?: string;
  observedWithChildren?: string;
  interactionDescription?: string;
  suitabilityConcerns?: string;
  integrityConcerns: string;
  integrityConcernsDetails?: string;
  wouldRecommend: string;
  recommendationComments?: string;
  additionalInformation?: string;
  declarationAccurate: boolean;
  signatureName: string;
  signatureDate: string;
}

interface ReferencePDFProps {
  referenceData: ReferenceData;
  refereeName: string;
  refereeRelationship: string;
  applicantName: string;
  isChildcareReference: boolean;
  submittedDate?: string;
}

export function ReferencePDF({
  referenceData,
  refereeName,
  refereeRelationship,
  applicantName,
  isChildcareReference,
  submittedDate,
}: ReferencePDFProps) {
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Reference Form</Text>
          <Text style={styles.subtitle}>
            For: {applicantName}
            {isChildcareReference && " (Childcare Reference)"}
          </Text>
          <Text style={styles.subtitle}>
            Completed by: {refereeName} ({refereeRelationship})
          </Text>
          {submittedDate && (
            <Text style={styles.subtitle}>
              Submitted: {formatDate(submittedDate)}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Confirmation of Relationship</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Confirmed relationship to applicant</Text>
            <Text style={styles.value}>{referenceData.confirmedRelationship || "N/A"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Known the applicant for (years)</Text>
            <Text style={styles.value}>{referenceData.knownForYears || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Character Assessment</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Character description</Text>
            <Text style={styles.value}>{referenceData.characterDescription || "N/A"}</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.label}>Reliable and trustworthy?</Text>
            <Text style={styles.value}>{referenceData.isReliable || "N/A"}</Text>
            {referenceData.reliableComments && (
              <Text style={[styles.value, { marginTop: 3 }]}>
                Comments: {referenceData.reliableComments}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Patient and calm under pressure?</Text>
            <Text style={styles.value}>{referenceData.isPatient || "N/A"}</Text>
            {referenceData.patientComments && (
              <Text style={[styles.value, { marginTop: 3 }]}>
                Comments: {referenceData.patientComments}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Good judgment and decision-making?</Text>
            <Text style={styles.value}>{referenceData.hasGoodJudgment || "N/A"}</Text>
            {referenceData.judgmentComments && (
              <Text style={[styles.value, { marginTop: 3 }]}>
                Comments: {referenceData.judgmentComments}
              </Text>
            )}
          </View>
        </View>

        {isChildcareReference && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Childcare Suitability</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Observed with children?</Text>
              <Text style={styles.value}>{referenceData.observedWithChildren || "N/A"}</Text>
            </View>
            {referenceData.interactionDescription && (
              <View style={styles.field}>
                <Text style={styles.label}>Description of interaction</Text>
                <Text style={styles.value}>{referenceData.interactionDescription}</Text>
              </View>
            )}
            {referenceData.suitabilityConcerns && (
              <View style={styles.field}>
                <Text style={styles.label}>Concerns about suitability</Text>
                <Text style={styles.value}>{referenceData.suitabilityConcerns}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isChildcareReference ? "4" : "3"}. Professional Opinion
          </Text>
          <View style={styles.field}>
            <Text style={styles.label}>Any concerns about integrity or conduct?</Text>
            <Text style={styles.value}>{referenceData.integrityConcerns || "N/A"}</Text>
            {referenceData.integrityConcernsDetails && (
              <Text style={[styles.value, { marginTop: 3 }]}>
                Details: {referenceData.integrityConcernsDetails}
              </Text>
            )}
          </View>
          
          <View style={styles.card}>
            <Text style={styles.label}>Would you recommend this person for childcare work?</Text>
            <Text style={styles.value}>{referenceData.wouldRecommend || "N/A"}</Text>
            {referenceData.recommendationComments && (
              <Text style={[styles.value, { marginTop: 3 }]}>
                Comments: {referenceData.recommendationComments}
              </Text>
            )}
          </View>

          {referenceData.additionalInformation && (
            <View style={styles.field}>
              <Text style={styles.label}>Additional information</Text>
              <Text style={styles.value}>{referenceData.additionalInformation}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isChildcareReference ? "5" : "4"}. Declaration
          </Text>
          <View style={styles.field}>
            <Text style={styles.label}>Declaration confirmed</Text>
            <Text style={styles.value}>
              {referenceData.declarationAccurate ? "Yes" : "No"}
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Signature</Text>
            <Text style={styles.value}>{referenceData.signatureName || "N/A"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDate(referenceData.signatureDate)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Reference Form - Generated on {new Date().toLocaleDateString("en-GB")} at{" "}
            {new Date().toLocaleTimeString("en-GB")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
