import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import EnvironmentalChange from "./components/EnvironmentalChange.jsx";
import PromoBar from "./components/PromoBar.jsx";
import EnvironmentalFields from "./components/EnvironmentalFields.jsx";
import MediaInfoSection from "./components/MediaInfoSection.jsx";
import WasteToResourceSection from "./components/WasteToResourceSection.jsx";
import BranchMap from "./components/BranchMap.jsx";
import BannerCollection from "./components/BannerCollection.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <div className="site-bg" aria-hidden="true">
        <video
          className="site-bg-video"
          src="/videos/Sunlight.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="site-bg-tint" />
      </div>

      <Header />
      <main id="top">
        <Hero />
        <PromoBar />
        <EnvironmentalChange />
        <EnvironmentalFields />
        <WasteToResourceSection />
        <MediaInfoSection />
        <BranchMap />
        <BannerCollection />
      </main>
      <Footer />
    </>
  );
}
