import AnalogClock from "../components/widgets/AnalogClock";
import MiniCalendar from "../components/widgets/MiniCalendar";
import FormSerahTerimaAditive from "../components/widgets/FormSerahTerimaAditive";
import FotoWidget from "../components/widgets/FotoWidget";
import SheetWidget from "../components/widgets/SheetWidget";

// ... dst

export default function Home() {
  return (
    <div className="widgets-grid">
      <AnalogClock />
      <MiniCalendar />
      <FormSerahTerimaAditive />
      <FotoWidget src="/assets/foto1.jpg" caption="Line 1" />
      <FotoWidget src="/assets/foto2.jpg" />
      <FotoWidget src="/assets/foto3.jpg" caption="Line 3" />
      <SheetWidget
        title="Stok Additive"
        sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vTEnjzI7-T4r0EskDCDoPk_yV3eYAfAzreHG2VrfuYcfafaaJmpT7B_Jm-AkWtjof-RApfbpMTleO-G/pub?gid=0&single=true&output=csv"
      />
      {/* tinggal tambah/yang lain */}
    </div>
  );
}
