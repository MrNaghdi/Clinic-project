import FeatureStrip from "./FeatureStrip";
import ServicesSection from "./ServicesSection";
import SlideHome from "./SlideHome";
import TestimonialsSection from "./TestimonialsSection";
import TopDoctors from "./TopDoctors";
import WhyUsSection from "./WhyUsSection";

const MainHome = () => {
    return ( 
        <div className="mt-3">
            <SlideHome />
            <FeatureStrip/>
            <ServicesSection/>
            <TopDoctors/>
            <WhyUsSection/>
            <TestimonialsSection/>
        </div>
     );
}
 
export default MainHome;