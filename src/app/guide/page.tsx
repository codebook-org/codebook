import OldGuidePage from "./expage";
import ConvertedGuide from "./mdconvert";

export default function GuidePage() {
  //return (<OldGuidePage></OldGuidePage>);

  // Style block added for scroll behaviour. I didn't want to edit layout.js directly.
  return (
    <div>
      <style>{`html { scroll-behavior: smooth; }`}</style>
      <ConvertedGuide />
    </div>
  );
}
