import AirKoreaWidget from "./AirKoreaWidget.jsx";
import SocialFollow from "./SocialFollow.jsx";
import "./PromoBar.css";

export default function PromoBar() {
  return (
    <section className="promo-bar" aria-label="실시간 대기 정보 및 SNS">
      <div className="promo-bar-inner">
        <div className="promo-bar-air">
          <AirKoreaWidget />
        </div>
        <div className="promo-bar-social">
          <SocialFollow />
        </div>
      </div>
    </section>
  );
}
