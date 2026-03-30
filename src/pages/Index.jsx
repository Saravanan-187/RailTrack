import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrainResults from "@/components/TrainResults";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchData, setSearchData] = useState(null);

  const handleSearch = (searchForm) => {
    setSearchData(searchForm);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onSearch={handleSearch} />
        <TrainResults searchCriteria={searchData} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;