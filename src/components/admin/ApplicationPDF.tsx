import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ChildminderApplication } from '@/types/childminder';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: 2,
    borderBottomColor: '#0f172a',
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0f172a',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0f172a',
  },
  metaInfo: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 5,
  },
  applicantName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 3,
  },
  submittedDate: {
    fontSize: 9,
    color: '#64748b',
  },
  
  // Section styling - matches border-l-4 border-primary pl-6
  section: {
    marginBottom: 20,
    paddingLeft: 15,
    borderLeft: 3,
    borderLeftColor: '#2563eb',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f172a',
  },
  
  // Definition list styling
  dlContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  dlRow: {
    marginBottom: 8,
  },
  dlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dlGridItem: {
    width: '50%',
    marginBottom: 8,
  },
  dtLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  ddValue: {
    fontSize: 9,
    color: '#0f172a',
  },
  
  // Nested items with border-l-2
  nestedItem: {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    borderLeft: 2,
    borderLeftColor: '#e2e8f0',
  },
  nestedItemBold: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  nestedItemMuted: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 1,
  },
  
  // Background boxes - matches bg-muted/30 p-3 rounded
  bgBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 3,
  },
  
  // Subsection headings
  subsectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#0f172a',
  },
  
  // Divider - matches border-t pt-4
  divider: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
  },
  
  // Grid layouts
  grid2Col: {
    flexDirection: 'row',
    gap: 10,
  },
  grid2ColItem: {
    flex: 1,
  },
  grid4Col: {
    flexDirection: 'row',
    gap: 5,
  },
  grid4ColItem: {
    flex: 1,
    fontSize: 8,
  },
  
  // Checkbox styling
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 10,
    height: 10,
    border: 1.5,
    borderColor: '#cbd5e1',
    marginRight: 5,
    marginTop: 1,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    backgroundColor: '#2563eb',
    border: 1.5,
    borderColor: '#2563eb',
    marginRight: 5,
    marginTop: 1,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 7,
    paddingTop: 0.5,
  },
  checkboxLabel: {
    fontSize: 8,
    flex: 1,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#94a3b8',
    paddingTop: 8,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
  },
});

interface ApplicationPDFProps {
  application: Partial<ChildminderApplication>;
  applicationId: string;
  submittedDate: string;
  status: string;
}

export const ApplicationPDF = ({ application, applicationId, submittedDate, status }: ApplicationPDFProps) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMMM yyyy');
    } catch {
      return date;
    }
  };

  const formatDateShort = (date: string | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return date;
    }
  };

  return (
    <Document>
      {/* Page 1: Header + Sections 1-2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brandName}>Ready Kids</Text>
          <Text style={styles.pageTitle}>Childminder Application</Text>
          <Text style={styles.metaInfo}>
            Application ID: {applicationId} | Status: {status.toUpperCase()}
          </Text>
          <Text style={styles.applicantName}>
            {application.title} {application.firstName} {application.middleNames || ''} {application.lastName}
          </Text>
          <Text style={styles.submittedDate}>
            Submitted on {formatDate(submittedDate)}
          </Text>
        </View>

        {/* Section 1: Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Personal Details</Text>
          <View style={styles.dlGrid}>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Title</Text>
              <Text style={styles.ddValue}>{application.title || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>First Name</Text>
              <Text style={styles.ddValue}>{application.firstName || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Middle Names</Text>
              <Text style={styles.ddValue}>{application.middleNames || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Last Name</Text>
              <Text style={styles.ddValue}>{application.lastName || 'N/A'}</Text>
            </View>
          </View>
          
          {application.previousNames && application.previousNames.length > 0 && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Previous Names</Text>
              {application.previousNames.map((name: any, idx: number) => (
                <Text key={idx} style={[styles.ddValue, { fontSize: 8, marginTop: 2 }]}>
                  {name.fullName} ({name.dateFrom} to {name.dateTo})
                </Text>
              ))}
            </View>
          )}

          <View style={styles.dlGrid}>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Gender</Text>
              <Text style={styles.ddValue}>{application.gender || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Date of Birth</Text>
              <Text style={styles.ddValue}>{formatDate(application.dob)}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>National Insurance Number</Text>
              <Text style={styles.ddValue}>{application.niNumber || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Email</Text>
              <Text style={styles.ddValue}>{application.email || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Mobile Phone</Text>
              <Text style={styles.ddValue}>{application.phone || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Address History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Address History</Text>
          <View style={styles.dlRow}>
            <Text style={styles.dtLabel}>Current Address</Text>
            <Text style={styles.ddValue}>
              {application.homeAddress?.line1}
              {application.homeAddress?.line2 ? `, ${application.homeAddress.line2}` : ''}
              {', '}{application.homeAddress?.town}, {application.homeAddress?.postcode}
            </Text>
          </View>

          {application.addressHistory && application.addressHistory.length > 0 && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Previous Addresses (5 Year History)</Text>
              {application.addressHistory.map((addr: any, idx: number) => (
                <View key={idx} style={styles.nestedItem}>
                  <Text style={styles.nestedItemBold}>
                    {addr.address?.line1}, {addr.address?.town}, {addr.address?.postcode}
                  </Text>
                  <Text style={styles.nestedItemMuted}>
                    Moved in: {addr.moveIn} | Moved out: {addr.moveOut}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>

      {/* Page 2: Sections 3-4 */}
      <Page size="A4" style={styles.page}>
        {/* Section 3: Premises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Premises</Text>
          <View style={styles.dlGrid}>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Local Authority</Text>
              <Text style={styles.ddValue}>{application.localAuthority || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Premises Type</Text>
              <Text style={styles.ddValue}>{application.premisesType || 'N/A'}</Text>
            </View>
            <View style={styles.dlGridItem}>
              <Text style={styles.dtLabel}>Pets</Text>
              <Text style={styles.ddValue}>{application.pets || 'N/A'}</Text>
            </View>
          </View>
          
          {application.petsDetails && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Pet Details</Text>
              <Text style={styles.ddValue}>{application.petsDetails}</Text>
            </View>
          )}

          {application.childcareAddress && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Childcare Address</Text>
              <Text style={styles.ddValue}>
                {application.childcareAddress.line1}
                {application.childcareAddress.line2 ? `, ${application.childcareAddress.line2}` : ''}
                {', '}{application.childcareAddress.town}, {application.childcareAddress.postcode}
              </Text>
            </View>
          )}
        </View>

        {/* Section 4: Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Service Details</Text>
          <View style={styles.dlRow}>
            <Text style={styles.dtLabel}>Age Groups</Text>
            <Text style={styles.ddValue}>{application.ageGroups?.join(', ') || 'N/A'}</Text>
          </View>
          
          <View style={styles.dlRow}>
            <Text style={styles.dtLabel}>Proposed Capacity</Text>
            <View style={styles.grid4Col}>
              <View style={styles.grid4ColItem}>
                <Text>Under 1: {application.proposedUnder1 || 0}</Text>
              </View>
              <View style={styles.grid4ColItem}>
                <Text>Under 5: {application.proposedUnder5 || 0}</Text>
              </View>
              <View style={styles.grid4ColItem}>
                <Text>5-8 years: {application.proposed5to8 || 0}</Text>
              </View>
              <View style={styles.grid4ColItem}>
                <Text>8+ years: {application.proposed8plus || 0}</Text>
              </View>
            </View>
          </View>

          {application.childcareTimes && application.childcareTimes.length > 0 && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Childcare Times</Text>
              <Text style={styles.ddValue}>{application.childcareTimes.join(', ')}</Text>
            </View>
          )}
        </View>

        {/* Section 5: Qualifications & Training */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Qualifications & Training</Text>
          
          {/* First Aid */}
          <View style={styles.dlRow}>
            <Text style={styles.dtLabel}>First Aid Training</Text>
            <View style={styles.bgBox}>
              <View style={styles.grid2Col}>
                <View style={styles.grid2ColItem}>
                  <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completed</Text>
                  <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.firstAid?.completed || 'No'}</Text>
                </View>
                {application.firstAid?.completed === 'Yes' && (
                  <>
                    <View style={styles.grid2ColItem}>
                      <Text style={[styles.dtLabel, { fontSize: 7 }]}>Provider</Text>
                      <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.firstAid.provider || 'N/A'}</Text>
                    </View>
                    <View style={styles.grid2ColItem}>
                      <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completion Date</Text>
                      <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.firstAid.completionDate || 'N/A'}</Text>
                    </View>
                    <View style={styles.grid2ColItem}>
                      <Text style={[styles.dtLabel, { fontSize: 7 }]}>Certificate Number</Text>
                      <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.firstAid.certificateNumber || 'N/A'}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Safeguarding */}
          {application.safeguarding && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Safeguarding Training</Text>
              <View style={styles.bgBox}>
                <View style={styles.grid2Col}>
                  <View style={styles.grid2ColItem}>
                    <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completed</Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.safeguarding.completed || 'No'}</Text>
                  </View>
                  {application.safeguarding.completed === 'Yes' && (
                    <>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Provider</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.safeguarding.provider || 'N/A'}</Text>
                      </View>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completion Date</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.safeguarding.completionDate || 'N/A'}</Text>
                      </View>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Certificate Number</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.safeguarding.certificateNumber || 'N/A'}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* EYFS/Childminding */}
          {application.eyfsChildminding && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>EYFS/Childminding Course</Text>
              <View style={styles.bgBox}>
                <View style={styles.grid2Col}>
                  <View style={styles.grid2ColItem}>
                    <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completed</Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.eyfsChildminding.completed || 'No'}</Text>
                  </View>
                  {application.eyfsChildminding.completed === 'Yes' && (
                    <>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Provider</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.eyfsChildminding.provider || 'N/A'}</Text>
                      </View>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completion Date</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.eyfsChildminding.completionDate || 'N/A'}</Text>
                      </View>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Certificate Number</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.eyfsChildminding.certificateNumber || 'N/A'}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Level 2 Qualification */}
          {application.level2Qual && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Level 2 Qualification</Text>
              <View style={styles.bgBox}>
                <View style={styles.grid2Col}>
                  <View style={styles.grid2ColItem}>
                    <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completed</Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.level2Qual.completed || 'No'}</Text>
                  </View>
                  {application.level2Qual.completed === 'Yes' && (
                    <>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Provider</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.level2Qual.provider || 'N/A'}</Text>
                      </View>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Completion Date</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.level2Qual.completionDate || 'N/A'}</Text>
                      </View>
                      <View style={styles.grid2ColItem}>
                        <Text style={[styles.dtLabel, { fontSize: 7 }]}>Certificate Number</Text>
                        <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.level2Qual.certificateNumber || 'N/A'}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text>Application ID: {applicationId} | Ready Kids Childminder Application | Page 2</Text>
        </View>
      </Page>

      {/* Page 3: Sections 6-7 */}
      <Page size="A4" style={styles.page}>
        {/* Section 6: Employment History & References */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Employment History & References</Text>
          
          <View style={styles.dlRow}>
            <Text style={styles.dtLabel}>Employment/Education History (5 Years)</Text>
            {application.employmentHistory && application.employmentHistory.length > 0 ? (
              application.employmentHistory.map((job: any, idx: number) => (
                <View key={idx} style={styles.nestedItem}>
                  <Text style={styles.nestedItemBold}>{job.role} at {job.employer}</Text>
                  <Text style={styles.nestedItemMuted}>{job.startDate} to {job.endDate}</Text>
                  <Text style={[styles.ddValue, { fontSize: 8, marginTop: 2 }]}>
                    Reason for leaving: {job.reasonForLeaving}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.ddValue, { color: '#64748b' }]}>No employment history provided</Text>
            )}
          </View>

          <View style={styles.divider}>
            <Text style={styles.subsectionTitle}>References</Text>
            
            {/* Reference 1 */}
            <View style={styles.bgBox}>
              <Text style={[styles.ddValue, { fontWeight: 'bold', marginBottom: 5 }]}>Reference 1</Text>
              <View style={styles.grid2Col}>
                <View style={styles.grid2ColItem}>
                  <Text style={[styles.dtLabel, { fontSize: 7 }]}>Full Name</Text>
                  <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference1Name || 'N/A'}</Text>
                </View>
                <View style={styles.grid2ColItem}>
                  <Text style={[styles.dtLabel, { fontSize: 7 }]}>Relationship</Text>
                  <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference1Relationship || 'N/A'}</Text>
                </View>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.dtLabel, { fontSize: 7 }]}>Contact Details</Text>
                <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference1Contact || 'N/A'}</Text>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.dtLabel, { fontSize: 7 }]}>Childcare Reference</Text>
                <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference1Childcare || 'N/A'}</Text>
              </View>
            </View>

            {/* Reference 2 */}
            <View style={[styles.bgBox, { marginTop: 10 }]}>
              <Text style={[styles.ddValue, { fontWeight: 'bold', marginBottom: 5 }]}>Reference 2</Text>
              <View style={styles.grid2Col}>
                <View style={styles.grid2ColItem}>
                  <Text style={[styles.dtLabel, { fontSize: 7 }]}>Full Name</Text>
                  <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference2Name || 'N/A'}</Text>
                </View>
                <View style={styles.grid2ColItem}>
                  <Text style={[styles.dtLabel, { fontSize: 7 }]}>Relationship</Text>
                  <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference2Relationship || 'N/A'}</Text>
                </View>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.dtLabel, { fontSize: 7 }]}>Contact Details</Text>
                <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference2Contact || 'N/A'}</Text>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.dtLabel, { fontSize: 7 }]}>Childcare Reference</Text>
                <Text style={[styles.ddValue, { fontSize: 8 }]}>{(application as any).reference2Childcare || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 7: People Connected to Application */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. People Connected to Application</Text>
          
          {application.assistants && application.assistants.length > 0 && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Assistants</Text>
              {application.assistants.map((person: any, idx: number) => (
                <View key={idx} style={styles.bgBox}>
                  <Text style={styles.nestedItemBold}>{person.fullName}</Text>
                  <Text style={styles.nestedItemMuted}>Relationship: {person.relationship}</Text>
                  <Text style={styles.nestedItemMuted}>DOB: {person.dob}</Text>
                </View>
              ))}
            </View>
          )}

          {application.adults && application.adults.length > 0 && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Adults in Household</Text>
              {application.adults.map((person: any, idx: number) => (
                <View key={idx} style={styles.bgBox}>
                  <Text style={styles.nestedItemBold}>{person.fullName}</Text>
                  <Text style={styles.nestedItemMuted}>Relationship: {person.relationship}</Text>
                  <Text style={styles.nestedItemMuted}>DOB: {person.dob}</Text>
                </View>
              ))}
            </View>
          )}

          {application.children && application.children.length > 0 && (
            <View style={styles.dlRow}>
              <Text style={styles.dtLabel}>Children in Household</Text>
              {application.children.map((child: any, idx: number) => (
                <View key={idx} style={styles.bgBox}>
                  <Text style={styles.nestedItemBold}>{child.fullName}</Text>
                  <Text style={styles.nestedItemMuted}>DOB: {child.dob}</Text>
                </View>
              ))}
            </View>
          )}

          {(!application.assistants || application.assistants.length === 0) &&
           (!application.adults || application.adults.length === 0) &&
           (!application.children || application.children.length === 0) && (
            <Text style={[styles.ddValue, { color: '#64748b' }]}>No people connected to application</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text>Application ID: {applicationId} | Ready Kids Childminder Application | Page 3</Text>
        </View>
      </Page>

      {/* Page 4: Section 8 */}
      <Page size="A4" style={styles.page}>
        {/* Section 8: Suitability & Vetting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Suitability & Vetting</Text>
          
          {/* Previous Registrations */}
          <View style={styles.dlRow}>
            <Text style={styles.subsectionTitle}>Previous Registrations</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Previously Registered with Ofsted</Text>
              <Text style={styles.ddValue}>{application.prevRegOfsted || 'N/A'}</Text>
              {application.prevRegOfsted === 'Yes' && application.prevRegOfstedDetails && application.prevRegOfstedDetails.length > 0 && (
                application.prevRegOfstedDetails.map((reg: any, idx: number) => (
                  <View key={idx} style={styles.bgBox}>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Regulator:</Text> {reg.regulator}
                    </Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Registration Number:</Text> {reg.registrationNumber}
                    </Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Dates:</Text> {reg.dates}
                    </Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Status:</Text> {reg.status}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Health & Lifestyle */}
          <View style={styles.divider}>
            <Text style={styles.subsectionTitle}>Health & Lifestyle</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Health Conditions</Text>
              <Text style={styles.ddValue}>{application.healthCondition || 'N/A'}</Text>
              {application.healthCondition === 'Yes' && application.healthConditionDetails && (
                <View style={styles.bgBox}>
                  <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.healthConditionDetails}</Text>
                </View>
              )}
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Smoker</Text>
              <Text style={styles.ddValue}>{(application as any).smoker || 'N/A'}</Text>
            </View>
          </View>

          {/* Suitability Declaration */}
          <View style={styles.divider}>
            <Text style={styles.subsectionTitle}>Suitability Declaration</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Disqualified from Childcare</Text>
              <Text style={styles.ddValue}>{(application as any).disqualified || 'N/A'}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Social Services Involvement</Text>
              <Text style={styles.ddValue}>{application.socialServices || 'N/A'}</Text>
              {application.socialServices === 'Yes' && application.socialServicesDetails && (
                <View style={styles.bgBox}>
                  <Text style={[styles.ddValue, { fontSize: 8 }]}>{application.socialServicesDetails}</Text>
                </View>
              )}
            </View>
          </View>

          {/* DBS & Vetting */}
          <View style={styles.divider}>
            <Text style={styles.subsectionTitle}>DBS & Vetting</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Has DBS Certificate</Text>
              <Text style={styles.ddValue}>{(application as any).hasDBS || 'N/A'}</Text>
            </View>

            {(application as any).hasDBS === 'Yes' && (
              <>
                <View style={{ marginBottom: 8 }}>
                  <Text style={styles.dtLabel}>DBS Certificate Number</Text>
                  <Text style={styles.ddValue}>{(application as any).dbsNumber || 'N/A'}</Text>
                </View>
                <View style={{ marginBottom: 8 }}>
                  <Text style={styles.dtLabel}>Enhanced DBS</Text>
                  <Text style={styles.ddValue}>{(application as any).dbsEnhanced || 'N/A'}</Text>
                </View>
                <View style={{ marginBottom: 8 }}>
                  <Text style={styles.dtLabel}>On DBS Update Service</Text>
                  <Text style={styles.ddValue}>{(application as any).dbsUpdate || 'N/A'}</Text>
                </View>
              </>
            )}

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Criminal Offence History</Text>
              <Text style={styles.ddValue}>{application.offenceHistory || 'N/A'}</Text>
              {application.offenceHistory === 'Yes' && application.offenceDetails && application.offenceDetails.length > 0 && (
                application.offenceDetails.map((offence: any, idx: number) => (
                  <View key={idx} style={styles.bgBox}>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Date:</Text> {offence.date}
                    </Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Description:</Text> {offence.description}
                    </Text>
                    <Text style={[styles.ddValue, { fontSize: 8 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Outcome:</Text> {offence.outcome}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Application ID: {applicationId} | Ready Kids Childminder Application | Page 4</Text>
        </View>
      </Page>

      {/* Page 5: Section 9 */}
      <Page size="A4" style={styles.page}>
        {/* Section 9: Declaration & Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Declaration & Payment</Text>
          
          <View style={styles.dlRow}>
            <Text style={styles.subsectionTitle}>Final Declarations</Text>
            
            <View style={styles.checkboxRow}>
              <View style={application.declarationAccuracy ? styles.checkboxChecked : styles.checkbox}>
                {application.declarationAccuracy && <Text>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Confirmed information is accurate and complete</Text>
            </View>

            <View style={styles.checkboxRow}>
              <View style={(application as any).declarationChangeNotification ? styles.checkboxChecked : styles.checkbox}>
                {(application as any).declarationChangeNotification && <Text>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Will notify of changes to circumstances</Text>
            </View>

            <View style={styles.checkboxRow}>
              <View style={(application as any).declarationInspectionCooperation ? styles.checkboxChecked : styles.checkbox}>
                {(application as any).declarationInspectionCooperation && <Text>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Agrees to cooperate with inspections</Text>
            </View>

            <View style={styles.checkboxRow}>
              <View style={(application as any).declarationInformationSharing ? styles.checkboxChecked : styles.checkbox}>
                {(application as any).declarationInformationSharing && <Text>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Consents to information sharing</Text>
            </View>

            <View style={styles.checkboxRow}>
              <View style={(application as any).declarationDataProcessing ? styles.checkboxChecked : styles.checkbox}>
                {(application as any).declarationDataProcessing && <Text>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Consents to data processing (GDPR)</Text>
            </View>
          </View>

          <View style={styles.divider}>
            <Text style={styles.subsectionTitle}>Electronic Signature</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Full Legal Name</Text>
              <Text style={[styles.ddValue, { fontWeight: 'bold' }]}>{application.signatureFullName || 'N/A'}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Date Signed</Text>
              <Text style={styles.ddValue}>{formatDate(application.signatureDate)}</Text>
            </View>
          </View>

          <View style={styles.divider}>
            <Text style={styles.subsectionTitle}>Payment Information</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Payment Method</Text>
              <Text style={styles.ddValue}>{application.paymentMethod || 'N/A'}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.dtLabel}>Application Fee</Text>
              <Text style={[styles.ddValue, { fontWeight: 'bold' }]}>
                {application.ageGroups?.includes('0-5') || application.ageGroups?.includes('5-7') ? '£200' : '£100'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Application ID: {applicationId} | Ready Kids Childminder Application | Page 5 (Final)</Text>
        </View>
      </Page>
    </Document>
  );
};
