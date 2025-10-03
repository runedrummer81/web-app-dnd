export default function Services() {
  const services = [
    {
      title: "Web Udvikling",
      description: "Moderne responsive websites",
      icon: "💻"
    },
    {
      title: "App Udvikling",
      description: "Native og cross-platform apps",
      icon: "📱"
    },
    {
      title: "Cloud Services",
      description: "Deployment og hosting",
      icon: "☁️"
    }
  ];

  return (
    <section className="page">
      <h1>Vores Services</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}