import { useEffect } from "react";
import { useLocation } from "wouter";
import Scrims from "./scrims";

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to scrims page as the main app functionality
    setLocation("/scrims");
  }, [setLocation]);

  // Render scrims page directly
  return <Scrims />;
}
