export const colors = {
  primary: '#1d4ed8',
  primaryBg: '#dbeafe',
  danger: '#991b1b',
  dangerBg: '#fee2e2',
  background: '#f9f9f9',
  cardBg: '#f0f0f0',
  text: '#334155',
  border: '#777',
  error: '#dc2626',
  errorBg: '#fef2f2'
};

export const globalStyles = {
  card: { padding: '15px', border: '1px solid black', flex: '1 1 150px', backgroundColor: colors.cardBg },
  section: { padding: '15px', border: '1px solid black', backgroundColor: colors.background },
  input: { padding: '8px', border: `1px solid ${colors.border}`, fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' },
  inputError: { padding: '8px', border: `2px solid ${colors.error}`, backgroundColor: colors.errorBg, fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' },
  errorText: { color: colors.error, fontSize: '12px', marginTop: '2px', fontWeight: 'bold' },
  label: { fontSize: '13px', fontWeight: '500', color: colors.text },
  inputGroup: { display: 'flex', gap: '8px', marginBottom: '15px' },
  list: { paddingLeft: '0', listStyle: 'none', margin: '0' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '5px' },
  th: { padding: '8px', border: '1px solid black', backgroundColor: '#e0e0e0', textAlign: 'left', whiteSpace: 'nowrap' },
  td: { padding: '8px', border: '1px solid black', verticalAlign: 'middle' },
  btn: { padding: '8px 12px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#e0e0e0', color: 'black', fontWeight: '500', whiteSpace: 'nowrap' },
  btnEdit: { padding: '5px 10px', cursor: 'pointer', border: `1px solid ${colors.primary}`, backgroundColor: colors.primaryBg, color: '#8b8f99', fontWeight: '500', whiteSpace: 'nowrap' },
  btnDanger: { padding: '5px 10px', cursor: 'pointer', border: `1px solid ${colors.danger}`, backgroundColor: colors.dangerBg, color: colors.danger, fontWeight: '500', whiteSpace: 'nowrap' },
  alertDanger: { color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', border: '1px solid #fca5a5', marginTop: '10px', borderRadius: '4px' }
};