import { img as withBase } from "../lib/basePath";

const FEATURED = [
  "IMG_0038.webp",
  "IMG_0106.webp",
  "IMG_0123(1).webp",
  "IMG_0152.webp",
  "IMG_0295.webp",
  "IMG_0357.webp",
  "IMG_0420.webp",
  "IMG_0421.webp",
  "IMG_0422.webp",
  "IMG_0423.webp",
];

export default function FeaturedCarousel() {
  const mid = Math.ceil(FEATURED.length / 2);
  const rowA = FEATURED.slice(0, mid);
  const rowB = FEATURED.slice(mid);

  return (
    <section className="featured-section">
      <div className="featured-head">
        <p className="featured-kicker">Recién salidas del telar</p>
        <h2 className="featured-title">Lo nuevo, de un vistazo</h2>
      </div>

      <div className="featured-marquee">
        <div className="featured-row featured-row--left">
          {[...rowA, ...rowA].map((img, i) => (
            <div className="featured-slide" key={`a-${img}-${i}`}>
              <img
                src={withBase(`/images/products/${img}`)}
                alt="Pieza tejida a mano de TuftForest GT"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="featured-row featured-row--right">
          {[...rowB, ...rowB].map((img, i) => (
            <div className="featured-slide" key={`b-${img}-${i}`}>
              <img
                src={withBase(`/images/products/${img}`)}
                alt="Pieza tejida a mano de TuftForest GT"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
