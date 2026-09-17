type SubjectIllustrationName = "maths" | "literacy" | "science";

type SubjectIllustrationProps = {
  name: SubjectIllustrationName;
  inverted?: boolean;
};

const ink = "#111A4A";
const yellow = "#FFD21F";
const green = "#55B925";
const blue = "#0868BF";
const paper = "#FFFDF7";

function MathematicsIllustration({ inverted = false }: { inverted?: boolean }) {
  const stroke = inverted ? paper : ink;

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 220 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M46 42V126M174 42V126M34 126H186" stroke={stroke} strokeWidth="8" strokeLinecap="round" />
      {[54, 79, 104].map((y) => (
        <path key={y} d={`M48 ${y}H172`} stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      ))}
      <g stroke={stroke} strokeWidth="4">
        <circle cx="70" cy="54" r="11" fill={yellow} />
        <circle cx="98" cy="54" r="11" fill={green} />
        <circle cx="136" cy="79" r="11" fill={blue} />
        <circle cx="162" cy="79" r="11" fill={yellow} />
        <circle cx="75" cy="104" r="11" fill={blue} />
        <circle cx="103" cy="104" r="11" fill={yellow} />
        <circle cx="131" cy="104" r="11" fill={green} />
      </g>
      <g fill={stroke} fontFamily="Arial, sans-serif" fontSize="22" fontWeight="900">
        <text x="52" y="30">1</text>
        <text x="99" y="30">2</text>
        <text x="148" y="30">3</text>
      </g>
    </svg>
  );
}

function LiteracyIllustration({ inverted = false }: { inverted?: boolean }) {
  const stroke = inverted ? paper : ink;

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 220 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29 43C62 35 87 42 108 56V128C84 113 59 108 29 116V43Z"
        fill={paper}
        stroke={stroke}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M191 43C158 35 133 42 112 56V128C136 113 161 108 191 116V43Z"
        fill={paper}
        stroke={stroke}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M110 57V128" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <g fill={stroke} fontFamily="Arial, sans-serif" fontSize="27" fontWeight="900">
        <text x="49" y="79">A</text>
        <text x="80" y="101">B</text>
        <text x="138" y="83">C</text>
      </g>
      <path d="M153 111L190 73" stroke={yellow} strokeWidth="12" strokeLinecap="round" />
      <path d="M190 73L197 65" stroke={stroke} strokeWidth="8" strokeLinecap="round" />
      <path d="M153 111L149 122L160 118" fill={green} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function ScienceIllustration({ inverted = false }: { inverted?: boolean }) {
  const stroke = inverted ? paper : ink;

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 220 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M87 24H133M99 24V64L66 119C61 128 68 137 78 137H142C152 137 159 128 154 119L121 64V24" stroke={stroke} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M78 111C95 96 127 125 145 106L154 122C158 130 151 137 142 137H78C69 137 62 129 67 121L78 111Z" fill={blue} />
      <circle cx="101" cy="99" r="7" fill={yellow} stroke={stroke} strokeWidth="3" />
      <circle cx="126" cy="113" r="5" fill={green} stroke={stroke} strokeWidth="3" />
      <circle cx="92" cy="62" r="7" fill={green} stroke={stroke} strokeWidth="3" />
      <circle cx="143" cy="46" r="5" fill={yellow} stroke={stroke} strokeWidth="3" />
      <path d="M40 58C55 48 69 53 75 68C60 73 47 69 40 58Z" fill={green} stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      <path d="M48 58L69 67" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M166 40L169 49L178 52L169 55L166 64L163 55L154 52L163 49L166 40Z" fill={yellow} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function SubjectIllustration({ name, inverted = false }: SubjectIllustrationProps) {
  if (name === "maths") {
    return <MathematicsIllustration inverted={inverted} />;
  }

  if (name === "literacy") {
    return <LiteracyIllustration inverted={inverted} />;
  }

  return <ScienceIllustration inverted={inverted} />;
}
