export default function DeleteAccount() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Delete Your NestMe Account</h1>

        <p style={styles.text}>
          If you wish to delete your NestMe account and all associated data,
          please follow the steps below.
        </p>

        <h3 style={styles.subtitle}>Steps to Request Account Deletion:</h3>
        <ol style={styles.list}>
          <li>Send an email to <b>support@nestme.in</b></li>
          <li>Use the subject: <b>Delete My Account</b></li>
          <li>Include your registered mobile number or email ID</li>
        </ol>

        <h3 style={styles.subtitle}>What Happens Next:</h3>
        <ul style={styles.list}>
          <li>Your account will be deleted within 3–5 business days</li>
          <li>All associated data will be permanently removed</li>
        </ul>

        <p style={styles.note}>
          If you face any issues, please contact our support team.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    maxWidth: "700px",
    width: "100%",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "18px",
    marginTop: "20px",
    marginBottom: "10px",
    color: "#1e293b",
  },
  text: {
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.6",
  },
  list: {
    paddingLeft: "20px",
    color: "#334155",
    lineHeight: "1.6",
  },
  note: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#64748b",
  },
};