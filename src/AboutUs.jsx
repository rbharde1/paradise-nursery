import './AboutUs.css';

/**
 * Company blurb shown on the landing page.
 */
function AboutUs() {
  return (
    <section className="about-us">
      <h2 className="about-us-heading">About Paradise Nursery</h2>

      <p className="about-us-text">
        Paradise Nursery is a family-run greenhouse that has been growing houseplants
        for over twenty years. We believe a home feels finished the moment something
        living is in it, so we raise every plant ourselves — from cutting to canopy —
        in soil we mix on site.
      </p>

      <p className="about-us-text">
        Our collection is chosen for real homes, not showrooms. Whether you have a
        bright south-facing window or a dim corner you had given up on, there is a
        plant here that will thrive in it. Each one ships potted, hydrated, and with
        a care card written by the grower who looked after it.
      </p>

      <p className="about-us-text">
        Browse our air-purifying, low-maintenance, and statement collections, and let
        us help you turn your space into a little more of a paradise.
      </p>

      <ul className="about-us-points">
        <li>Grown on site, never drop-shipped</li>
        <li>30-day healthy arrival guarantee</li>
        <li>Plastic-free, compostable packaging</li>
      </ul>
    </section>
  );
}

export default AboutUs;
