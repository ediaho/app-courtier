// pages/index.js
import dynamic from "next/dynamic";

const CourtierApp = dynamic(() => import("../components/CourtierApp"), { ssr: false });

export default function Home() {
  return <CourtierApp />;
}
