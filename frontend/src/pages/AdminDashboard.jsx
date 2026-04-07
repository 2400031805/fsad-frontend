function AdminDashboard() {
  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Admin Dashboard</h2>
        <p>Manage resources, counseling availability, and student support groups.</p>
      </div>
      <div className="admin-grid">
        <article className="admin-card">
          <h3>Resources</h3>
          <p>Create, update, and curate mental health articles, tools, and guides for students.</p>
        </article>
        <article className="admin-card">
          <h3>Counseling Sessions</h3>
          <p>Review requests, set counselor availability, and confirm session details.</p>
        </article>
        <article className="admin-card">
          <h3>Support Groups</h3>
          <p>Update group topics, manage facilitators, and monitor attendance trends.</p>
        </article>
      </div>
    </section>
  );
}

export default AdminDashboard;
