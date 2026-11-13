function Notifications({ notifications, user }) {
    const myNotifications = notifications.filter(n =>
        n.patientId === user.id || n.doctorId === user.id );
    return (
        <div className="page">
            <h1>Notifications</h1>
            {myNotifications.length === 0 && (
                <p>No notifications yet.</p>
            )}
            {myNotifications.slice().reverse().map(n => (
                <div className="notification-card" key={n.id}>
                    <p>{n.message}</p>
                    <small>{n.date}</small>
                </div>
            ))}
        </div>
    );
}

export default Notifications;
