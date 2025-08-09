const AboutSection = () => {
  return (
    <section className="container py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">About Discover Larne</h2>
          <p className="text-muted-foreground leading-relaxed">
            Discover Larne is a community project celebrating the people and places along the Causeway Coastal Route. 
            We collect stories, showcase local businesses and landmarks, and invite everyone to explore and contribute.
          </p>
        </div>
        <div className="bg-secondary rounded-2xl p-6">
          <p className="text-secondary-foreground">
            From dramatic cliffs to charming harbours, Larne is a gateway to Northern Ireland’s stunning coastline. 
            Dive into authentic local stories and find your next place to visit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
