import { motion, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";

interface SkillCircleProps {
  label: string;
  percentage: number;
  delay?: number;
}

function SkillCircle({ label, percentage, delay = 0 }: SkillCircleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = percentage;
      if (start === end) return;
      const duration = 1.5;
      const incrementTime = (duration / end) * 1000;

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, percentage]);

  return (
    <div className="flex flex-col items-center gap-6" ref={ref}>
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Circle */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="absolute -rotate-90 transform"
        >
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated Circle */}
          <motion.circle
            stroke="#FF0000"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
            transition={{ duration: 1.5, ease: "easeOut", delay }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]"
          />
        </svg>
        <div className="absolute text-2xl font-bold text-white">
          {count}%
        </div>
      </div>
      <span className="text-white/70 font-medium tracking-wide">{label}</span>
    </div>
  );
}

export function Skills() {
  const skills = [
    { label: "Figma", percentage: 64 },
    { label: "UX", percentage: 40 },
    { label: "Adobe Photoshop", percentage: 20 },
    { label: "React", percentage: 80 },
  ];

  return (
    <section className="py-20 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 justify-center items-center">
          {skills.map((skill, index) => (
            <SkillCircle
              key={skill.label}
              label={skill.label}
              percentage={skill.percentage}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
