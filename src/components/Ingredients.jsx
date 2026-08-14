const origins = [
  { region: 'Assam, India', ingredient: 'Agarwood Oud', desc: 'Harvested from centuries-old Aquilaria trees. The rarest resin in the world of perfumery.' },
  { region: 'Taif, Saudi Arabia', ingredient: 'Damask Rose', desc: 'Picked at dawn during a two-week harvest window. A rose unlike any other on earth.' },
  { region: 'Madagascar', ingredient: 'Bourbon Vanilla', desc: 'Hand-pollinated and cured for six months to develop deep, complex sweetness.' },
  { region: 'Mysore, India', ingredient: 'Sandalwood', desc: 'Sustainably sourced from mature trees. Creamy, warm, and impossibly smooth.' },
];

export default function Ingredients() {
  return (
    <section className="bg-[#faf7f2] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-16 max-w-lg">
          <p className="section-label mb-3">The Source</p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-[#1a1612] leading-tight">
            Ingredients that
            <br />
            <em className="italic">travel the world</em>
          </h2>
        </div>

        {/* Origins list */}
        <div className="flex flex-col divide-y divide-[#e8d5b0]">
          {origins.map((item, i) => (
            <div
              key={i}
              className="group grid grid-cols-1 md:grid-cols-[180px_1fr_2fr] gap-4 md:gap-8 py-8 items-start hover:bg-[#f5f0e8] transition-colors duration-300 -mx-6 lg:-mx-12 px-6 lg:px-12 cursor-default"
            >
              <span className="font-body text-[0.55rem] tracking-[0.3em] uppercase text-[#c9a96e] mt-1">
                {item.region}
              </span>
              <h3 className="font-display text-xl font-light text-[#1a1612] group-hover:text-[#c9a96e] transition-colors duration-300">
                {item.ingredient}
              </h3>
              <p className="font-body text-xs font-light text-[#8b7d6b] leading-relaxed max-w-md">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
